// ========== EVALUATION MANAGER ==========
// MANAGES PROFILE PICTURES IN PENDING EVALUATIONS SECTION

class EvaluationManager {
    // INITIALIZES THE EVALUATION MANAGER
    constructor() {
        this.initialized = false;
        this.observer = null;
    }

    // INITIALIZE THE EVALUATION MANAGER
    init() {
        if (this.initialized) return;

        // Check if we're on a page that could have evaluations
        if (!this.shouldRun()) return;

        this.setupObserver();
        this.addProfilePictures();
        this.initialized = true;

        console.log('EvaluationManager initialized');
    }

    // CHECK IF MANAGER SHOULD RUN ON CURRENT PAGE
    shouldRun() {
        // Run on meta.intra.42.fr or profile pages
        const url = window.location.href;
        return url.includes('meta.intra.42.fr') ||
               url.includes('profile') ||
               url.includes('/users/');
    }

    // SETUP MUTATION OBSERVER TO DETECT WHEN EVALUATION ELEMENTS ARE ADDED
    setupObserver() {
        if (this.observer) {
            this.observer.disconnect();
        }

        this.observer = new MutationObserver((mutations) => {
            let needsRefresh = false;

            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            // Check if evaluation-related elements were added
                            if (node.textContent &&
                                (node.textContent.includes('evaluate') ||
                                 node.textContent.includes('PENDING EVALUATIONS'))) {
                                needsRefresh = true;
                            }
                        }
                    });
                }
            });

            if (needsRefresh) {
                setTimeout(() => {
                    this.addProfilePictures();
                }, 200);
            }
        });

        this.observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // ADD PROFILE PICTURES TO EVALUATION LINES
    addProfilePictures() {
        // Find all text nodes containing "evaluate" or similar patterns
        const walker = document.createTreeWalker(
            document.body,
            NodeFilter.SHOW_TEXT,
            {
                acceptNode: (node) => {
                    const text = node.textContent.trim();
                    // Match patterns like "You will evaluate username on Project"
                    if (text.includes('evaluate') || text.includes('evaluat')) {
                        return NodeFilter.FILTER_ACCEPT;
                    }
                    return NodeFilter.FILTER_SKIP;
                }
            }
        );

        const evaluationNodes = [];
        let node;
        while (node = walker.nextNode()) {
            evaluationNodes.push(node);
        }

        evaluationNodes.forEach(textNode => {
            this.processEvaluationNode(textNode);
        });
    }

    // PROCESS AN EVALUATION NODE TO ADD PROFILE PICTURE
    processEvaluationNode(textNode) {
        const text = textNode.textContent;

        // Extract username from text like "You will evaluate ameduboi on NetPractice"
        const usernameMatch = text.match(/evaluate\s+([a-z][a-z0-9-_]+)/i);
        if (!usernameMatch) return;

        const username = usernameMatch[1];

        // Get the parent element that contains the evaluation line
        let parentElement = textNode.parentElement;

        // Try to find a better container (usually a div or p)
        while (parentElement &&
               parentElement !== document.body &&
               !['DIV', 'P', 'LI', 'SPAN'].includes(parentElement.tagName)) {
            parentElement = parentElement.parentElement;
        }

        if (!parentElement || parentElement === document.body) return;

        // Check if we already added a profile picture
        if (parentElement.querySelector('.eval-profile-pic')) return;

        // Add profile picture
        this.insertProfilePicture(parentElement, username);
    }

    // INSERT PROFILE PICTURE ELEMENT
    insertProfilePicture(container, username) {
        // Create profile picture element
        const profilePicContainer = document.createElement('div');
        profilePicContainer.className = 'eval-profile-pic';

        const profilePic = document.createElement('img');
        profilePic.src = `https://cdn.intra.42.fr/users/${username}.jpg`;
        profilePic.alt = username;
        profilePic.title = username;

        // Handle image load error
        profilePic.onerror = () => {
            // Fallback: use default avatar or initials
            profilePic.style.display = 'none';
            const fallback = document.createElement('div');
            fallback.className = 'eval-profile-pic-fallback';
            fallback.textContent = username.substring(0, 2).toUpperCase();
            profilePicContainer.appendChild(fallback);
        };

        profilePicContainer.appendChild(profilePic);

        // Add styles
        this.injectStyles();

        // Insert at the beginning of the container
        if (container.firstChild) {
            container.insertBefore(profilePicContainer, container.firstChild);
        } else {
            container.appendChild(profilePicContainer);
        }

        // Adjust container layout
        container.style.display = 'flex';
        container.style.alignItems = 'center';
        container.style.gap = '12px';
    }

    // INJECT CSS STYLES FOR PROFILE PICTURES
    injectStyles() {
        if (document.getElementById('evaluation-manager-styles')) return;

        const style = document.createElement('style');
        style.id = 'evaluation-manager-styles';
        style.textContent = `
            .eval-profile-pic {
                width: 40px !important;
                height: 40px !important;
                border-radius: 50% !important;
                overflow: hidden !important;
                flex-shrink: 0 !important;
                border: 2px solid var(--better42-primary, #6366f1) !important;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2) !important;
                transition: transform 0.2s ease, box-shadow 0.2s ease !important;
            }

            .eval-profile-pic:hover {
                transform: scale(1.1) !important;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3) !important;
            }

            .eval-profile-pic img {
                width: 100% !important;
                height: 100% !important;
                object-fit: cover !important;
                display: block !important;
            }

            .eval-profile-pic-fallback {
                width: 100% !important;
                height: 100% !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                background: linear-gradient(135deg, var(--better42-primary, #6366f1), var(--better42-primary-light, #818cf8)) !important;
                color: white !important;
                font-weight: bold !important;
                font-size: 14px !important;
            }

            /* Dark theme adjustments */
            body.dark-theme .eval-profile-pic {
                border-color: var(--better42-primary, #818cf8) !important;
            }

            /* Responsive adjustments */
            @media (max-width: 768px) {
                .eval-profile-pic {
                    width: 32px !important;
                    height: 32px !important;
                }

                .eval-profile-pic-fallback {
                    font-size: 12px !important;
                }
            }
        `;

        document.head.appendChild(style);
    }

    // REFRESH THE EVALUATION MANAGER
    refresh() {
        if (this.initialized) {
            this.addProfilePictures();
        }
    }

    // DESTROY THE EVALUATION MANAGER AND CLEANUP
    destroy() {
        this.initialized = false;

        if (this.observer) {
            this.observer.disconnect();
            this.observer = null;
        }

        // Remove all added profile pictures
        document.querySelectorAll('.eval-profile-pic').forEach(el => el.remove());

        // Remove styles
        const styleElement = document.getElementById('evaluation-manager-styles');
        if (styleElement) {
            styleElement.remove();
        }
    }
}

// Create global instance
window.EvaluationManager = new EvaluationManager();
