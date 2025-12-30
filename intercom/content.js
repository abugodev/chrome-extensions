// Intercom Actions Extension
// Adds an Actions section to the sidebar with a webhook button

(function() {
  'use strict';

  // Configuration
  const WEBHOOK_URL = 'https://abugo.app.n8n.cloud/webhook/queue-article'; // Placeholder URL
  
  // Wait for DOM to be ready
  function waitForElement(selector, timeout = 10000) {
    return new Promise((resolve, reject) => {
      const element = document.querySelector(selector);
      if (element) {
        resolve(element);
        return;
      }

      const observer = new MutationObserver((mutations, obs) => {
        const element = document.querySelector(selector);
        if (element) {
          obs.disconnect();
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

  // Extract article ID from URL
  function getArticleId() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('activeContentId');
  }

  // Get current language
  function getCurrentLanguage() {
    const sidebar = document.querySelector('.side-panel');
    if (!sidebar) return null;

    // Find the Language section
    const grids = sidebar.querySelectorAll('.grid.grid-cols-2');
    for (let grid of grids) {
      const firstCol = grid.querySelector('div:first-child');
      if (firstCol && firstCol.textContent.includes('Language')) {
        const secondCol = grid.querySelector('.col-span-1');
        if (secondCol) {
          const languageSpan = secondCol.querySelector('.truncate, span');
          if (languageSpan) {
            return languageSpan.textContent.trim();
          }
        }
      }
    }
    return null;
  }

  // Create the Actions section HTML
  function createActionsSection() {
    const sectionId = `actions-section-${Date.now()}`;
    const panelId = `actions-panel-${Date.now()}`;
    
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
                                <div class="flex items-center justify-center gap-2">
                                  <svg class="interface-icon o__standard" width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M8 0C3.58 0 0 3.58 0 8C0 12.42 3.58 16 8 16C12.42 16 16 12.42 16 8C16 3.58 12.42 0 8 0ZM8 14.5C4.41 14.5 1.5 11.59 1.5 8C1.5 4.41 4.41 1.5 8 1.5C11.59 1.5 14.5 4.41 14.5 8C14.5 11.59 11.59 14.5 8 14.5ZM2.5 6.5C2.8 5.2 3.4 4 4.2 3L5.5 6.5H2.5ZM2.5 9.5H5.5L4.2 13C3.4 12 2.8 10.8 2.5 9.5ZM6.5 13.8C7.8 13.5 9 12.9 10 12.1L6.5 10.8V13.8ZM6.5 5.2V8.2L10 6.9C9 6.1 7.8 5.5 6.5 5.2ZM11.8 13L10.5 9.5H13.5C13.2 10.8 12.6 12 11.8 13ZM13.5 6.5H10.5L11.8 3C12.6 4 13.2 5.2 13.5 6.5Z"></path>
                                  </svg>
                                  <span>Translate to all languages</span>
                                </div>
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

  // Insert Actions section between Data and Fin sections
  async function insertActionsSection() {
    try {
      // Wait for the sidebar structure to be available
      const sidebarContainer = await waitForElement('.side-panel .overflow-auto > div', 5000).catch(() => null);
      
      if (!sidebarContainer) {
        console.warn('Sidebar container not found');
        return;
      }
      
      // Check if Actions section already exists
      const existingActions = Array.from(sidebarContainer.querySelectorAll('[data-intercom-target="section"]')).find(
        section => section.textContent && section.textContent.includes('Actions')
      );
      if (existingActions) {
        // Re-initialize in case the page was updated
        initializeActionsSection();
        return;
      }
      
      // Find the Data section (ends before Fin section)
      const allSections = sidebarContainer.querySelectorAll('.border-b.border-neutral-border');
      
      if (allSections.length === 0) {
        console.warn('No sections found in sidebar');
        return;
      }

      // Find the Data section - it's the one before Fin
      // We'll look for the section containing "Data" text
      let dataSection = null;
      let finSection = null;

      for (let section of allSections) {
        const text = section.textContent || '';
        if (text.includes('Data') && text.includes('Type') && !dataSection) {
          dataSection = section;
        }
        if (text.includes('Fin') && text.includes('When enabled, Fin will use')) {
          finSection = section;
          break;
        }
      }

      // If we found both sections, insert between them
      if (dataSection && finSection) {
        // Create and insert the Actions section
        const actionsHTML = createActionsSection();
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = actionsHTML.trim();
        const actionsSection = tempDiv.firstElementChild;

        // Insert after Data section, before Fin section
        dataSection.parentNode.insertBefore(actionsSection, finSection);

        // Initialize the button and display info
        setTimeout(initializeActionsSection, 100);
      } else {
        console.warn('Could not find Data or Fin sections, trying fallback');
        // Fallback: try to insert after first section
        if (allSections.length > 0) {
          const actionsHTML = createActionsSection();
          const tempDiv = document.createElement('div');
          tempDiv.innerHTML = actionsHTML.trim();
          const actionsSection = tempDiv.firstElementChild;
          allSections[0].parentNode.insertBefore(actionsSection, allSections[1] || null);
          setTimeout(initializeActionsSection, 100);
        }
      }
    } catch (error) {
      console.error('Error inserting Actions section:', error);
    }
  }

  // Check if "Save as draft" button is enabled (not disabled)
  function isDraftButtonEnabled() {
    // Look for button with "Save as draft" text
    const buttons = Array.from(document.querySelectorAll('button'));
    const draftButton = buttons.find(btn => 
      btn.textContent && btn.textContent.trim().includes('Save as draft')
    );
    
    if (!draftButton) {
      // If draft button doesn't exist, assume it's safe to translate
      return false;
    }
    
    // Check if button has disabled attribute or o__disabled class
    const isDisabled = draftButton.hasAttribute('disabled') || 
                       draftButton.classList.contains('o__disabled');
    
    // Return true if button is enabled (not disabled)
    return !isDisabled;
  }

  // Initialize the Actions section functionality
  function initializeActionsSection() {
    const button = document.getElementById('actions-webhook-button');
    const articleIdSpan = document.getElementById('actions-article-id');

    if (!button) {
      console.error('Actions button not found');
      return;
    }

    // Update displayed info
    const articleId = getArticleId();
    const currentLanguage = getCurrentLanguage();

    if (articleIdSpan) {
      articleIdSpan.textContent = articleId || 'Not found';
    }

    // Function to update button state based on language and draft button state
    let lastButtonState = null;
    function updateButtonState() {
      const currentLanguage = getCurrentLanguage();
      const isEnglish = currentLanguage && currentLanguage.toLowerCase() === 'english';
      const draftEnabled = isDraftButtonEnabled();
      const btn = document.getElementById('actions-webhook-button');
      
      if (!btn) return;
      
      // Disable if not English OR if draft button is enabled
      const shouldDisable = !isEnglish || draftEnabled;
      const newState = {
        disabled: shouldDisable,
        isEnglish: isEnglish,
        draftEnabled: draftEnabled
      };
      
      // Only update if state actually changed to prevent infinite loops
      if (lastButtonState && 
          lastButtonState.disabled === newState.disabled &&
          lastButtonState.isEnglish === newState.isEnglish &&
          lastButtonState.draftEnabled === newState.draftEnabled) {
        return;
      }
      
      lastButtonState = newState;
      btn.disabled = shouldDisable;
      
      if (!isEnglish) {
        btn.classList.add('opacity-50', 'cursor-not-allowed');
        btn.title = 'This action is only available for English articles';
      } else if (draftEnabled) {
        btn.classList.add('opacity-50', 'cursor-not-allowed');
        btn.title = 'Please save as draft first';
      } else {
        btn.classList.remove('opacity-50', 'cursor-not-allowed');
        btn.title = '';
      }
    }

    // Debounce function to prevent too many rapid updates
    let updateTimeout = null;
    function debouncedUpdateButtonState() {
      if (updateTimeout) {
        clearTimeout(updateTimeout);
      }
      updateTimeout = setTimeout(() => {
        updateButtonState();
      }, 100);
    }

    // Update button state initially
    updateButtonState();

    // Watch for language changes in sidebar only
    let lastLanguage = currentLanguage;
    const languageObserver = new MutationObserver(() => {
      const newLanguage = getCurrentLanguage();
      if (newLanguage !== lastLanguage) {
        lastLanguage = newLanguage;
        debouncedUpdateButtonState();
      }
    });

    // Observe only the sidebar for language changes
    const sidebar = document.querySelector('.side-panel');
    if (sidebar) {
      languageObserver.observe(sidebar, {
        childList: true,
        subtree: true,
        characterData: true
      });
    }

    // Watch for draft button changes with more specific targeting
    let lastDraftState = null;
    const draftButtonObserver = new MutationObserver((mutations) => {
      // Only update if we see relevant changes
      let shouldUpdate = false;
      for (const mutation of mutations) {
        if (mutation.type === 'attributes' && 
            (mutation.attributeName === 'disabled' || mutation.attributeName === 'class')) {
          const target = mutation.target;
          if (target.textContent && target.textContent.includes('Save as draft')) {
            const currentDraftState = !target.hasAttribute('disabled') && 
                                     !target.classList.contains('o__disabled');
            if (currentDraftState !== lastDraftState) {
              lastDraftState = currentDraftState;
              shouldUpdate = true;
              break;
            }
          }
        }
      }
      if (shouldUpdate) {
        debouncedUpdateButtonState();
      }
    });

    // Observe document body but with throttling
    draftButtonObserver.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['disabled', 'class']
    });

    // Remove any existing click handlers by cloning the button
    const newButton = button.cloneNode(true);
    button.parentNode.replaceChild(newButton, button);
    const freshButton = document.getElementById('actions-webhook-button');

    // Add click handler
    freshButton.addEventListener('click', async () => {
      // Check if draft button is enabled first
      if (isDraftButtonEnabled()) {
        alert('Please save as draft first');
        return;
      }

      const articleId = getArticleId();

      if (!articleId) {
        alert('Error: Could not find article ID in URL');
        return;
      }

      // Disable button during request
      freshButton.disabled = true;
      const buttonContent = freshButton.querySelector('div');
      if (buttonContent) {
        buttonContent.innerHTML = '<span>Sending...</span>';
      }

      try {
        const response = await fetch(WEBHOOK_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            articleId: articleId
          })
        });

        let responseData;
        const contentType = response.headers.get('content-type');
        
        if (contentType && contentType.includes('application/json')) {
          try {
            responseData = await response.json();
          } catch (e) {
            responseData = await response.text().catch(() => 'No response body');
          }
        } else {
          responseData = await response.text().catch(() => 'No response body');
        }

        // Show alert with response
        const responseText = typeof responseData === 'string' 
          ? responseData 
          : JSON.stringify(responseData, null, 2);
        
        alert(`Webhook Response:\n\nStatus: ${response.status} ${response.statusText}\n\nResponse:\n${responseText}`);
      } catch (error) {
        alert(`Error calling webhook:\n\n${error.message}`);
        console.error('Webhook error:', error);
      } finally {
        // Re-enable button (if language is English and draft is saved)
        updateButtonState();
        const buttonContent = freshButton.querySelector('div');
        if (buttonContent) {
          buttonContent.innerHTML = `
            <svg class="interface-icon o__standard" width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 0C3.58 0 0 3.58 0 8C0 12.42 3.58 16 8 16C12.42 16 16 12.42 16 8C16 3.58 12.42 0 8 0ZM8 14.5C4.41 14.5 1.5 11.59 1.5 8C1.5 4.41 4.41 1.5 8 1.5C11.59 1.5 14.5 4.41 14.5 8C14.5 11.59 11.59 14.5 8 14.5ZM2.5 6.5C2.8 5.2 3.4 4 4.2 3L5.5 6.5H2.5ZM2.5 9.5H5.5L4.2 13C3.4 12 2.8 10.8 2.5 9.5ZM6.5 13.8C7.8 13.5 9 12.9 10 12.1L6.5 10.8V13.8ZM6.5 5.2V8.2L10 6.9C9 6.1 7.8 5.5 6.5 5.2ZM11.8 13L10.5 9.5H13.5C13.2 10.8 12.6 12 11.8 13ZM13.5 6.5H10.5L11.8 3C12.6 4 13.2 5.2 13.5 6.5Z"></path>
            </svg>
            <span>Translate to all languages</span>
          `;
        }
      }
    });
  }

  // Main initialization
  function init() {
    // Wait a bit for the page to fully load
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        setTimeout(insertActionsSection, 1000);
      });
    } else {
      setTimeout(insertActionsSection, 1000);
    }

    // Also listen for navigation changes (Intercom uses SPA)
    let lastUrl = location.href;
    new MutationObserver(() => {
      const url = location.href;
      if (url !== lastUrl) {
        lastUrl = url;
        setTimeout(insertActionsSection, 1000);
      }
    }).observe(document, { subtree: true, childList: true });
  }

  // Start the extension
  init();
})();

