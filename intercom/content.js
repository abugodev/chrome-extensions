// Intercom Actions Extension
// Adds an Actions section to the sidebar with a webhook button

(function() {
  'use strict';

  // ============================================================================
  // Configuration
  // ============================================================================
  const WEBHOOK_URL = 'https://abugo.app.n8n.cloud/webhook/queue-article';
  const INIT_DELAY_MS = 1000;
  const INIT_AFTER_INSERT_MS = 100;
  const SIDEBAR_WAIT_TIMEOUT_MS = 5000;
  const ELEMENT_WAIT_TIMEOUT_MS = 10000;

  // Button HTML templates
  const BUTTON_HTML_IDLE = `
    <div class="flex items-center justify-center gap-2">
      <svg class="interface-icon o__standard" width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
        <path d="M8 0C3.58 0 0 3.58 0 8C0 12.42 3.58 16 8 16C12.42 16 16 12.42 16 8C16 3.58 12.42 0 8 0ZM8 14.5C4.41 14.5 1.5 11.59 1.5 8C1.5 4.41 4.41 1.5 8 1.5C11.59 1.5 14.5 4.41 14.5 8C14.5 11.59 11.59 14.5 8 14.5ZM2.5 6.5C2.8 5.2 3.4 4 4.2 3L5.5 6.5H2.5ZM2.5 9.5H5.5L4.2 13C3.4 12 2.8 10.8 2.5 9.5ZM6.5 13.8C7.8 13.5 9 12.9 10 12.1L6.5 10.8V13.8ZM6.5 5.2V8.2L10 6.9C9 6.1 7.8 5.5 6.5 5.2ZM11.8 13L10.5 9.5H13.5C13.2 10.8 12.6 12 11.8 13ZM13.5 6.5H10.5L11.8 3C12.6 4 13.2 5.2 13.5 6.5Z"></path>
      </svg>
      <span>Translate to all languages</span>
    </div>
  `;
  const BUTTON_HTML_LOADING = '<div><span>Sending...</span></div>';

  // ============================================================================
  // Utility Functions
  // ============================================================================

  /**
   * Waits for an element to appear in the DOM
   * @param {string} selector - CSS selector
   * @param {number} timeout - Timeout in milliseconds
   * @returns {Promise<Element>}
   */
  function waitForElement(selector, timeout = ELEMENT_WAIT_TIMEOUT_MS) {
    return new Promise((resolve, reject) => {
      const element = document.querySelector(selector);
      if (element) {
        resolve(element);
        return;
      }

      const observer = new MutationObserver(() => {
        const element = document.querySelector(selector);
        if (element) {
          observer.disconnect();
          resolve(element);
        }
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true
      });

      setTimeout(() => {
        observer.disconnect();
        reject(new Error(`Element ${selector} not found within ${timeout}ms`));
      }, timeout);
    });
  }

  /**
   * Extracts article ID from URL query parameters
   * @returns {string|null}
   */
  function getArticleId() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('activeContentId');
  }

  /**
   * Checks if the current article language is English
   * @returns {boolean}
   */
  function isEnglishArticle() {
    const language = getCurrentLanguage();
    return language && language.toLowerCase() === 'english';
  }

  /**
   * Gets the current article language from the sidebar
   * @returns {string|null}
   */
  function getCurrentLanguage() {
    const sidebar = document.querySelector('.side-panel');
    if (!sidebar) return null;

    const grids = sidebar.querySelectorAll('.grid.grid-cols-2');
    for (const grid of grids) {
      const firstCol = grid.querySelector('div:first-child');
      if (firstCol?.textContent.includes('Language')) {
        const secondCol = grid.querySelector('.col-span-1');
        const languageSpan = secondCol?.querySelector('.truncate, span');
        if (languageSpan) {
          return languageSpan.textContent.trim();
        }
      }
    }
    return null;
  }

  /**
   * Checks if the "Save as draft" button is enabled (indicating unsaved changes)
   * @returns {boolean}
   */
  function hasUnsavedChanges() {
    const buttons = Array.from(document.querySelectorAll('button'));
    const draftButton = buttons.find(btn => 
      btn.textContent?.trim().includes('Save as draft')
    );
    
    if (!draftButton) return false;
    
    return !draftButton.hasAttribute('disabled') && 
           !draftButton.classList.contains('o__disabled');
  }

  /**
   * Creates HTML string for the Actions section
   * @returns {string}
   */
  function createActionsSectionHTML() {
    const timestamp = Date.now();
    const sectionId = `actions-section-${timestamp}`;
    const panelId = `actions-panel-${timestamp}`;
    
    return `
      <div class="border-b border-neutral-border">
        <div id="${panelId}" class="cp-Panels ember-view mx-6 my-5">
          <div id="pulse-accordion-${sectionId}" class="cp-Panel cp-is-open ember-view">
            <div class="accordion-new__section o__open" data-intercom-target="section" data-accordion-section="section">
              <div class="accordion-new__header flex flex-row opacity-100 o__open" data-ghostinspector-accordion-header="section">
                <div class="flex flex-row items-center gap-2 w-full justify-between">
                  <div class="flex flex-row items-center gap-2">
                    <svg class="interface-icon o__standard o__standard__play o__by-text o__no-margin" width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                      <path d="M6 3L13 8L6 13V3Z"></path>
                    </svg>
                    <span class="flex flex-row flex-1 text-support font-semibold">
                      Actions
                    </span>
                  </div>
                </div>
              </div>
              <div id="${sectionId}-body" class="cp-Panel-body cp-is-open ember-view">
                <div class="liquid-container ember-view" style="">
                  <div class="liquid-child ember-view" style="top: 0px; left: 0px;">
                    <div class="cp-Panel-body-inner">
                      <div class="accordion-new__body">
                        <div class="mt-4 mb-4">
                          <div class="flex flex-col gap-4">
                            <div class="w-full">
                              <button id="actions-webhook-button" class="btn o__primary o__fit ember-view" role="button" type="button">
                                ${BUTTON_HTML_IDLE}
                              </button>
                            </div>
                            <div class="text o__muted text-sm">
                              <div>Article ID: <span id="actions-article-id">-</span></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Parses response from fetch request
   * @param {Response} response
   * @returns {Promise<string>}
   */
  async function parseResponse(response) {
    const contentType = response.headers.get('content-type');
    
    if (contentType?.includes('application/json')) {
      try {
        const data = await response.json();
        return JSON.stringify(data, null, 2);
      } catch {
        return await response.text().catch(() => 'No response body');
      }
    }
    
    return await response.text().catch(() => 'No response body');
  }

  /**
   * Updates button visual state based on language
   * @param {HTMLButtonElement} button
   */
  function updateButtonState(button) {
    const isEnglish = isEnglishArticle();
    button.disabled = !isEnglish;
    
    if (!isEnglish) {
      button.classList.add('opacity-50', 'cursor-not-allowed');
      button.title = 'This action is only available for English articles';
    } else {
      button.classList.remove('opacity-50', 'cursor-not-allowed');
      button.title = '';
    }
  }

  /**
   * Restores button to idle state
   * @param {HTMLButtonElement} button
   */
  function restoreButtonContent(button) {
    const buttonContent = button.querySelector('div');
    if (buttonContent) {
      buttonContent.innerHTML = BUTTON_HTML_IDLE.trim();
    }
  }

  /**
   * Sets button to loading state
   * @param {HTMLButtonElement} button
   */
  function setButtonLoading(button) {
    button.disabled = true;
    const buttonContent = button.querySelector('div');
    if (buttonContent) {
      buttonContent.innerHTML = BUTTON_HTML_LOADING;
    }
  }

  // ============================================================================
  // Core Functions
  // ============================================================================

  /**
   * Finds Data and Fin sections in the sidebar
   * @param {Element} sidebarContainer
   * @returns {{dataSection: Element|null, finSection: Element|null}}
   */
  function findTargetSections(sidebarContainer) {
    const allSections = sidebarContainer.querySelectorAll('.border-b.border-neutral-border');
    let dataSection = null;
    let finSection = null;

    for (const section of allSections) {
      const text = section.textContent || '';
      if (text.includes('Data') && text.includes('Type') && !dataSection) {
        dataSection = section;
      }
      if (text.includes('Fin') && text.includes('When enabled, Fin will use')) {
        finSection = section;
        break;
      }
    }

    return { dataSection, finSection };
  }

  /**
   * Inserts Actions section into the sidebar
   */
  async function insertActionsSection() {
    try {
      const sidebarContainer = await waitForElement(
        '.side-panel .overflow-auto > div', 
        SIDEBAR_WAIT_TIMEOUT_MS
      ).catch(() => null);
      
      if (!sidebarContainer) {
        console.warn('[Intercom Actions] Sidebar container not found');
        return;
      }
      
      // Check if Actions section already exists
      const existingActions = Array.from(
        sidebarContainer.querySelectorAll('[data-intercom-target="section"]')
      ).find(section => section.textContent?.includes('Actions'));
      
      if (existingActions) {
        initializeActionsSection();
        return;
      }
      
      const { dataSection, finSection } = findTargetSections(sidebarContainer);

      if (dataSection && finSection) {
        const actionsHTML = createActionsSectionHTML();
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = actionsHTML.trim();
        const actionsSection = tempDiv.firstElementChild;

        dataSection.parentNode.insertBefore(actionsSection, finSection);
        setTimeout(initializeActionsSection, INIT_AFTER_INSERT_MS);
      } else {
        console.warn('[Intercom Actions] Could not find Data or Fin sections, trying fallback');
        const allSections = sidebarContainer.querySelectorAll('.border-b.border-neutral-border');
        if (allSections.length > 0) {
          const actionsHTML = createActionsSectionHTML();
          const tempDiv = document.createElement('div');
          tempDiv.innerHTML = actionsHTML.trim();
          const actionsSection = tempDiv.firstElementChild;
          allSections[0].parentNode.insertBefore(actionsSection, allSections[1] || null);
          setTimeout(initializeActionsSection, INIT_AFTER_INSERT_MS);
        }
      }
    } catch (error) {
      console.error('[Intercom Actions] Error inserting Actions section:', error);
    }
  }

  /**
   * Handles webhook button click
   * @param {HTMLButtonElement} button
   */
  async function handleWebhookClick(button) {
    // Validate language
    if (!isEnglishArticle()) {
      alert('This action is only available for English articles');
      return;
    }

    // Validate unsaved changes
    if (hasUnsavedChanges()) {
      alert('Please save as draft first before translating');
      return;
    }

    // Validate article ID
    const articleId = getArticleId();
    if (!articleId) {
      alert('Error: Could not find article ID in URL');
      return;
    }

    setButtonLoading(button);

    try {
      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ articleId })
      });

      const responseText = await parseResponse(response);
      alert(`Webhook Response:\n\nStatus: ${response.status} ${response.statusText}\n\nResponse:\n${responseText}`);
    } catch (error) {
      alert(`Error calling webhook:\n\n${error.message}`);
      console.error('[Intercom Actions] Webhook error:', error);
    } finally {
      updateButtonState(button);
      restoreButtonContent(button);
    }
  }

  /**
   * Initializes the Actions section functionality
   */
  function initializeActionsSection() {
    const button = document.getElementById('actions-webhook-button');
    const articleIdSpan = document.getElementById('actions-article-id');

    if (!button) {
      console.error('[Intercom Actions] Actions button not found');
      return;
    }

    // Update displayed article ID
    const articleId = getArticleId();
    if (articleIdSpan) {
      articleIdSpan.textContent = articleId || 'Not found';
    }

    // Set initial button state
    updateButtonState(button);

    // Watch for language changes
    let lastLanguage = getCurrentLanguage();
    const languageObserver = new MutationObserver(() => {
      const newLanguage = getCurrentLanguage();
      if (newLanguage !== lastLanguage) {
        lastLanguage = newLanguage;
        updateButtonState(button);
      }
    });

    const sidebar = document.querySelector('.side-panel');
    if (sidebar) {
      languageObserver.observe(sidebar, {
        childList: true,
        subtree: true,
        characterData: true
      });
    }

    // Remove existing handlers by cloning
    const newButton = button.cloneNode(true);
    button.parentNode.replaceChild(newButton, button);
    const freshButton = document.getElementById('actions-webhook-button');

    // Attach click handler
    freshButton.addEventListener('click', () => handleWebhookClick(freshButton));
  }

  // ============================================================================
  // Initialization
  // ============================================================================

  /**
   * Main initialization function
   */
  function init() {
    const scheduleInsert = () => {
      setTimeout(insertActionsSection, INIT_DELAY_MS);
    };

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', scheduleInsert);
    } else {
      scheduleInsert();
    }

    // Watch for SPA navigation changes
    let lastUrl = location.href;
    new MutationObserver(() => {
      const currentUrl = location.href;
      if (currentUrl !== lastUrl) {
        lastUrl = currentUrl;
        scheduleInsert();
      }
    }).observe(document, { 
      subtree: true, 
      childList: true 
    });
  }

  // Start the extension
  init();
})();
