class ClusterMapManager {
    // INITIALIZE CLUSTER MAP MANAGER WITH DEFAULT ZOOM AND DRAG SETTINGS
    constructor() {
        this.currentZoom = 1;
        this.minZoom = 1;
        this.maxZoom = 4;
        this.zoomStep = 0.3;
        this.svgElement = null;
        this.controlsAdded = false;
        this.isDragging = false;
        this.startX = 0;
        this.startY = 0;
        this.translateX = 0;
        this.translateY = 0;
    }

    // INITIALIZE THE CLUSTER MAP MANAGER WITH DELAYED LOADING
    init() {
        if (!this.shouldApplyToCurrentPage()) return;
        
        setTimeout(() => {
            if (this.shouldShowControls()) {
                this.findAndEnhanceClusterMap();
            }
        }, 1000);
        
        setTimeout(() => {
            if (this.shouldShowControls()) {
                this.findAndEnhanceClusterMap();
            }
        }, 3000);
    }

    // CHECK IF ZOOM CONTROLS SHOULD BE DISPLAYED BASED ON THEME
    shouldShowControls() {
        return window.ThemeManager && window.ThemeManager.isDark;
    }

    // REMOVE ALL ZOOM CONTROLS AND RESET ZOOM STATE
    removeControls() {
        const controls = document.querySelector('.cluster-zoom-controls');
        if (controls) {
            controls.remove();
        }
        
        if (this.svgElement) {
            this.svgElement.style.transform = '';
            this.svgElement.style.transformOrigin = '';
        }
        
        const style = document.getElementById('cluster-zoom-styles');
        if (style) {
            style.remove();
        }
        
        this.controlsAdded = false;
        this.currentZoom = 1;
        this.translateX = 0;
        this.translateY = 0;
        
    }

    // HANDLE THEME CHANGES BY ADDING OR REMOVING CONTROLS
    onThemeChange() {
        if (this.shouldShowControls() && !this.controlsAdded) {
            this.findAndEnhanceClusterMap();
        } else if (!this.shouldShowControls() && this.controlsAdded) {
            this.removeControls();
        }
    }

    // CHECK IF CURRENT PAGE SHOULD HAVE CLUSTER MAP FUNCTIONALITY
    shouldApplyToCurrentPage() {
        return window.location.hostname === 'meta.intra.42.fr' || 
               window.location.pathname.includes('cluster');
    }

    // FIND CLUSTER MAP ELEMENT AND ADD ZOOM FUNCTIONALITY
    findAndEnhanceClusterMap() {
        const clusterMap = document.getElementById('cluster-map');
        if (!clusterMap || this.controlsAdded) return;
        
        if (!this.shouldShowControls()) return;
        
        const svgElements = clusterMap.querySelectorAll('svg');
        if (svgElements.length === 0) return;

        this.svgElement = svgElements[0];
        this.addZoomControls(clusterMap);
        this.addZoomStyles();
        this.controlsAdded = true;
        
        this.applyZoom();
        
    }

    // ADD ZOOM CONTROL BUTTONS AND UI TO THE CLUSTER MAP
    addZoomControls(container) {
        const controlsDiv = document.createElement('div');
        controlsDiv.className = 'cluster-zoom-controls';
        controlsDiv.innerHTML = `
            <div class="zoom-buttons">
                <button id="zoom-reset" class="zoom-btn zoom-reset-btn" title="Reset zoom">Reset</button>
            </div>
            <div class="zoom-level">
                <span id="zoom-percentage">${Math.round(this.currentZoom * 100)}%</span>
            </div>
            <div class="zoom-info">
                <small>🖱️ Clic + glisser pour déplacer</small>
            </div>
        `;

        container.style.position = 'relative';
        container.appendChild(controlsDiv);

        this.attachZoomEvents();
    }

    // ATTACH EVENT LISTENERS FOR ZOOM CONTROLS AND INTERACTIONS
    attachZoomEvents() {
        const zoomResetBtn = document.getElementById('zoom-reset');

        if (zoomResetBtn) {
            zoomResetBtn.addEventListener('click', () => this.resetZoom());
        }

        if (this.svgElement) {
            this.svgElement.addEventListener('wheel', (e) => this.handleWheelZoom(e));
            this.addDragFunctionality();
        }
    }

    // INCREASE ZOOM LEVEL WITHIN MAXIMUM LIMITS
    zoomIn() {
        if (this.currentZoom < this.maxZoom) {
            this.currentZoom = Math.min(this.maxZoom, this.currentZoom + this.zoomStep);
            this.applyZoom();
        }
    }

    // DECREASE ZOOM LEVEL WITHIN MINIMUM LIMITS
    zoomOut() {
        if (this.currentZoom > this.minZoom) {
            this.currentZoom = Math.max(this.minZoom, this.currentZoom - this.zoomStep);
            this.applyZoom();
        }
    }

    // RESET ZOOM AND POSITION TO DEFAULT VALUES
    resetZoom() {
        this.currentZoom = 1;
        this.translateX = 0;
        this.translateY = 0;
        this.applyZoom();
    }

    // ADD DRAG AND TOUCH FUNCTIONALITY TO CLUSTER MAP
    addDragFunctionality() {
        const container = this.svgElement.closest('.map-container');
        if (!container) return;

        container.style.userSelect = 'none';
        this.svgElement.style.userSelect = 'none';

        container.addEventListener('mousedown', (e) => this.startDrag(e));
        container.addEventListener('mousemove', (e) => this.drag(e));
        container.addEventListener('mouseup', () => this.endDrag());
        container.addEventListener('mouseleave', () => this.endDrag());

        container.addEventListener('touchstart', (e) => this.startDrag(e.touches[0]));
        container.addEventListener('touchmove', (e) => {
            e.preventDefault();
            this.drag(e.touches[0]);
        });
        container.addEventListener('touchend', () => this.endDrag());
    }

    // INITIALIZE DRAG OPERATION WITH STARTING COORDINATES
    startDrag(e) {
        e.preventDefault();
        this.isDragging = true;
        this.startX = e.clientX - this.translateX;
        this.startY = e.clientY - this.translateY;
        
        const container = this.svgElement.closest('.map-container');
        if (container) {
            container.style.cursor = 'grabbing';
        }
    }

    // HANDLE DRAG MOVEMENT AND UPDATE POSITION
    drag(e) {
        if (!this.isDragging) return;
        
        e.preventDefault();
        this.translateX = e.clientX - this.startX;
        this.translateY = e.clientY - this.startY;
        
        this.applyZoom();
    }

    // END DRAG OPERATION AND RESET CURSOR
    endDrag() {
        this.isDragging = false;
        
        const container = this.svgElement.closest('.map-container');
        if (container) {
            container.style.cursor = 'grab';
        }
    }

    // HANDLE MOUSE WHEEL ZOOM FUNCTIONALITY
    handleWheelZoom(e) {
        e.preventDefault();
        e.stopPropagation();
        
        const zoomAmount = e.deltaY > 0 ? -this.zoomStep : this.zoomStep;
        const newZoom = Math.max(this.minZoom, Math.min(this.maxZoom, this.currentZoom + zoomAmount));
        
        if (newZoom !== this.currentZoom) {
            this.currentZoom = newZoom;
            this.applyZoom();
        }
    }

    // APPLY CURRENT ZOOM AND POSITION TRANSFORMS TO SVG ELEMENT
    applyZoom() {
        if (!this.svgElement) return;

        this.svgElement.style.transform = `translate(${this.translateX}px, ${this.translateY}px) scale(${this.currentZoom})`;
        this.svgElement.style.transformOrigin = 'center center';
        
        const container = this.svgElement.closest('.map-container');
        if (container) {
            container.style.overflow = 'hidden';
            container.style.cursor = this.currentZoom > 1 ? 'grab' : 'default';
        }

        this.updateZoomDisplay();
        this.updateButtonStates();
    }

    // UPDATE ZOOM PERCENTAGE DISPLAY IN UI
    updateZoomDisplay() {
        const zoomPercentage = document.getElementById('zoom-percentage');
        if (zoomPercentage) {
            zoomPercentage.textContent = `${Math.round(this.currentZoom * 100)}%`;
        }
    }

    // UPDATE ZOOM BUTTON STATES BASED ON CURRENT ZOOM LEVEL
    updateButtonStates() {
        
    }

    // ADD CSS STYLES FOR ZOOM CONTROLS AND INTERACTIONS
    addZoomStyles() {
        const existingStyle = document.getElementById('cluster-zoom-styles');
        if (existingStyle) return;

        const style = document.createElement('style');
        style.id = 'cluster-zoom-styles';
        style.textContent = `
            .cluster-zoom-controls {
                position: absolute;
                top: 10px;
                right: 10px;
                z-index: 1000;
                display: flex;
                flex-direction: column;
                gap: 8px;
                background: rgba(0, 0, 0, 0.8);
                padding: 12px;
                border-radius: 12px;
                backdrop-filter: blur(10px);
                border: 1px solid rgba(255, 255, 255, 0.1);
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
            }

            .zoom-buttons {
                display: flex;
                flex-direction: column;
                gap: 4px;
            }

            .zoom-btn {
                width: 40px;
                height: 40px;
                border: none;
                border-radius: 8px;
                cursor: pointer;
                font-size: 18px;
                font-weight: bold;
                transition: all 0.2s ease;
                display: flex;
                align-items: center;
                justify-content: center;
                user-select: none;
                -webkit-user-select: none;
                -moz-user-select: none;
                -ms-user-select: none;
            }

            .zoom-reset-btn {
                background: linear-gradient(135deg, #6366f1, #818cf8);
                color: white;
                font-size: 14px;
                padding: 8px 16px;
                width: auto;
                height: auto;
                min-width: 60px;
            }

            .zoom-reset-btn:hover {
                background: linear-gradient(135deg, #4f46e5, #6366f1);
                transform: translateY(-1px);
                box-shadow: 0 4px 12px rgba(99, 102, 241, 0.4);
            }

            .zoom-btn:disabled {
                opacity: 0.5;
                cursor: not-allowed;
                transform: none !important;
                box-shadow: none !important;
            }

            .zoom-level {
                text-align: center;
                color: white;
                font-size: 12px;
                font-weight: 600;
                background: rgba(255, 255, 255, 0.1);
                padding: 6px 8px;
                border-radius: 6px;
                min-width: 50px;
            }

            .zoom-info {
                text-align: center;
                color: rgba(255, 255, 255, 0.7);
                font-size: 10px;
                padding: 4px;
                background: rgba(255, 255, 255, 0.05);
                border-radius: 4px;
            }

            .zoom-info small {
                display: block;
                line-height: 1.2;
            }

            .map-container {
                position: relative;
                transition: all 0.3s ease;
                user-select: none;
                -webkit-user-select: none;
                -moz-user-select: none;
                -ms-user-select: none;
            }

            .map-container svg {
                transition: transform 0.1s ease;
                cursor: grab;
                user-select: none;
                -webkit-user-select: none;
                -moz-user-select: none;
                -ms-user-select: none;
            }

            .map-container svg:active {
                cursor: grabbing;
            }

            .map-container {
                user-select: none;
                -webkit-user-select: none;
                -moz-user-select: none;
                -ms-user-select: none;
            }

            body.dark-theme .cluster-zoom-controls {
                background: var(--better42-bg-dark);
                border-color: var(--better42-primary);
            }

            body.dark-theme .zoom-reset-btn {
                background: linear-gradient(135deg, var(--better42-primary), var(--better42-primary-light));
            }

            body.dark-theme .zoom-reset-btn:hover {
                background: linear-gradient(135deg, var(--better42-primary-light), var(--better42-primary-lighter));
                box-shadow: 0 4px 12px var(--better42-primary-dark-alpha));
            }

            @media (max-width: 768px) {
                .cluster-zoom-controls {
                    top: 5px;
                    right: 5px;
                    padding: 8px;
                }

                .zoom-btn {
                    width: 35px;
                    height: 35px;
                    font-size: 16px;
                }

                .zoom-level {
                    font-size: 11px;
                    padding: 4px 6px;
                }

                .zoom-info {
                    font-size: 9px;
                    padding: 2px 4px;
                }

                .zoom-info small {
                    font-size: 8px;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

window.ClusterMapManager = new ClusterMapManager();