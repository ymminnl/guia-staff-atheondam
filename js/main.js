/**
 * AtheOneDam Staff Guide - Main JavaScript
 * Version 2.0 - Octubre 2025
 */

// ============================================
// NAVIGATION & SCROLL
// ============================================

// Smooth scroll to anchor links
document.addEventListener('DOMContentLoaded', function() {
    
    // Smooth scroll for all internal links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Back to top button
    createBackToTopButton();
    
    // Table of contents generator
    generateTableOfContents();
    
    // Highlight active section on scroll
    highlightActiveSection();
    
    // Copy code blocks functionality
    addCopyButtonsToCodeBlocks();
    
    // Search functionality
    initializeSearch();
});

// ============================================
// BACK TO TOP BUTTON
// ============================================

function createBackToTopButton() {
    const button = document.createElement('button');
    button.innerHTML = `
        <svg fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
        </svg>
    `;
    button.className = 'back-to-top';
    button.setAttribute('aria-label', 'Volver arriba');
    button.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        border: none;
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
        z-index: 1000;
        display: flex;
        align-items: center;
        justify-content: center;
    `;
    
    button.querySelector('svg').style.cssText = `
        width: 24px;
        height: 24px;
    `;
    
    document.body.appendChild(button);
    
    // Show/hide button on scroll
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            button.style.opacity = '1';
            button.style.visibility = 'visible';
        } else {
            button.style.opacity = '0';
            button.style.visibility = 'hidden';
        }
    });
    
    // Scroll to top on click
    button.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Hover effect
    button.addEventListener('mouseenter', () => {
        button.style.transform = 'translateY(-3px)';
        button.style.boxShadow = '0 6px 16px rgba(102, 126, 234, 0.5)';
    });
    
    button.addEventListener('mouseleave', () => {
        button.style.transform = 'translateY(0)';
        button.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.4)';
    });
}

// ============================================
// TABLE OF CONTENTS GENERATOR
// ============================================

function generateTableOfContents() {
    const content = document.querySelector('.content-section');
    if (!content) return;
    
    const headings = content.querySelectorAll('h2');
    if (headings.length === 0) return;
    
    const tocContainer = document.createElement('nav');
    tocContainer.className = 'table-of-contents';
    tocContainer.style.cssText = `
        position: fixed;
        top: 120px;
        right: 30px;
        width: 280px;
        max-height: calc(100vh - 160px);
        overflow-y: auto;
        background: white;
        border: 1px solid #e2e8f0;
        border-radius: 16px;
        padding: 24px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
        z-index: 100;
        display: none;
    `;
    
    const tocTitle = document.createElement('h3');
    tocTitle.textContent = 'Contenido';
    tocTitle.style.cssText = `
        margin: 0 0 16px 0;
        font-size: 1em;
        font-weight: 700;
        color: #0f172a;
    `;
    
    const tocList = document.createElement('ul');
    tocList.style.cssText = `
        list-style: none;
        padding: 0;
        margin: 0;
    `;
    
    headings.forEach((heading, index) => {
        // Add ID to heading if it doesn't have one
        if (!heading.id) {
            heading.id = `section-${index}`;
        }
        
        const listItem = document.createElement('li');
        listItem.style.cssText = `
            margin: 0 0 8px 0;
        `;
        
        const link = document.createElement('a');
        link.href = `#${heading.id}`;
        link.textContent = heading.textContent;
        link.className = 'toc-link';
        link.style.cssText = `
            display: block;
            padding: 8px 12px;
            color: #64748b;
            text-decoration: none;
            border-radius: 8px;
            transition: all 0.2s ease;
            font-size: 0.875em;
            line-height: 1.4;
        `;
        
        link.addEventListener('mouseenter', () => {
            link.style.background = '#f8fafc';
            link.style.color = '#667eea';
        });
        
        link.addEventListener('mouseleave', () => {
            if (!link.classList.contains('active')) {
                link.style.background = 'transparent';
                link.style.color = '#64748b';
            }
        });
        
        listItem.appendChild(link);
        tocList.appendChild(listItem);
    });
    
    tocContainer.appendChild(tocTitle);
    tocContainer.appendChild(tocList);
    document.body.appendChild(tocContainer);
    
    // Show TOC on larger screens
    if (window.innerWidth > 1400) {
        tocContainer.style.display = 'block';
    }
    
    window.addEventListener('resize', () => {
        if (window.innerWidth > 1400) {
            tocContainer.style.display = 'block';
        } else {
            tocContainer.style.display = 'none';
        }
    });
}

// ============================================
// HIGHLIGHT ACTIVE SECTION
// ============================================

function highlightActiveSection() {
    const sections = document.querySelectorAll('h2[id]');
    const tocLinks = document.querySelectorAll('.toc-link');
    
    if (sections.length === 0 || tocLinks.length === 0) return;
    
    window.addEventListener('scroll', () => {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.pageYOffset >= sectionTop - 100) {
                current = section.getAttribute('id');
            }
        });
        
        tocLinks.forEach(link => {
            link.classList.remove('active');
            link.style.background = 'transparent';
            link.style.color = '#64748b';
            
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
                link.style.background = '#f1f5f9';
                link.style.color = '#667eea';
                link.style.fontWeight = '600';
            }
        });
    });
}

// ============================================
// COPY CODE BLOCKS
// ============================================

function addCopyButtonsToCodeBlocks() {
    const codeBlocks = document.querySelectorAll('pre code');
    
    codeBlocks.forEach(block => {
        const pre = block.parentElement;
        pre.style.position = 'relative';
        
        const button = document.createElement('button');
        button.className = 'copy-button';
        button.textContent = 'Copiar';
        button.style.cssText = `
            position: absolute;
            top: 12px;
            right: 12px;
            padding: 6px 12px;
            background: #334155;
            color: white;
            border: 1px solid #475569;
            border-radius: 6px;
            cursor: pointer;
            font-size: 0.75em;
            font-weight: 600;
            transition: all 0.2s ease;
        `;
        
        button.addEventListener('click', async () => {
            const text = block.textContent;
            try {
                await navigator.clipboard.writeText(text);
                button.textContent = '✓ Copiado';
                button.style.background = '#10b981';
                button.style.borderColor = '#059669';
                
                setTimeout(() => {
                    button.textContent = 'Copiar';
                    button.style.background = '#334155';
                    button.style.borderColor = '#475569';
                }, 2000);
            } catch (err) {
                button.textContent = '✗ Error';
                button.style.background = '#ef4444';
            }
        });
        
        button.addEventListener('mouseenter', () => {
            button.style.background = '#475569';
        });
        
        button.addEventListener('mouseleave', () => {
            if (button.textContent === 'Copiar') {
                button.style.background = '#334155';
            }
        });
        
        pre.appendChild(button);
    });
}

// ============================================
// SEARCH FUNCTIONALITY
// ============================================

function initializeSearch() {
    // Create search container
    const searchContainer = document.createElement('div');
    searchContainer.className = 'search-container';
    searchContainer.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        z-index: 1000;
        width: 90%;
        max-width: 600px;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
    `;
    
    searchContainer.innerHTML = `
        <div style="position: relative;">
            <input 
                type="text" 
                id="search-input" 
                placeholder="Buscar en la guía (presiona / para buscar)..."
                style="
                    width: 100%;
                    padding: 16px 48px 16px 20px;
                    border: 1px solid #e2e8f0;
                    border-radius: 12px;
                    font-size: 1em;
                    background: white;
                    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
                    outline: none;
                    transition: all 0.2s ease;
                "
            />
            <svg 
                id="search-close" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke-width="2" 
                stroke="currentColor"
                style="
                    position: absolute;
                    right: 16px;
                    top: 50%;
                    transform: translateY(-50%);
                    width: 24px;
                    height: 24px;
                    color: #64748b;
                    cursor: pointer;
                "
            >
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
        </div>
        <div id="search-results" style="
            margin-top: 12px;
            background: white;
            border: 1px solid #e2e8f0;
            border-radius: 12px;
            max-height: 400px;
            overflow-y: auto;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
            display: none;
        "></div>
    `;
    
    document.body.appendChild(searchContainer);
    
    const searchInput = document.getElementById('search-input');
    const searchResults = document.getElementById('search-results');
    const searchClose = document.getElementById('search-close');
    
    // Keyboard shortcut: / to open search
    document.addEventListener('keydown', (e) => {
        if (e.key === '/' && !searchInput.matches(':focus')) {
            e.preventDefault();
            showSearch();
        }
        
        if (e.key === 'Escape') {
            hideSearch();
        }
    });
    
    // Close search
    searchClose.addEventListener('click', hideSearch);
    
    // Search input
    searchInput.addEventListener('input', performSearch);
    
    function showSearch() {
        searchContainer.style.opacity = '1';
        searchContainer.style.visibility = 'visible';
        searchInput.focus();
    }
    
    function hideSearch() {
        searchContainer.style.opacity = '0';
        searchContainer.style.visibility = 'hidden';
        searchInput.value = '';
        searchResults.style.display = 'none';
    }
    
    function performSearch() {
        const query = searchInput.value.toLowerCase().trim();
        
        if (query.length < 2) {
            searchResults.style.display = 'none';
            return;
        }
        
        const content = document.querySelector('.content-section');
        const sections = content.querySelectorAll('h2, h3, h4, p, li, td');
        const results = [];
        
        sections.forEach(element => {
            const text = element.textContent.toLowerCase();
            if (text.includes(query)) {
                let heading = element;
                while (heading && !heading.matches('h2, h3')) {
                    heading = heading.previousElementSibling;
                }
                
                if (heading) {
                    const resultText = element.textContent.substring(0, 150);
                    results.push({
                        title: heading.textContent,
                        text: resultText,
                        element: element
                    });
                }
            }
        });
        
        displayResults(results.slice(0, 10)); // Show max 10 results
    }
    
    function displayResults(results) {
        if (results.length === 0) {
            searchResults.innerHTML = '<div style="padding: 20px; color: #64748b; text-align: center;">No se encontraron resultados</div>';
            searchResults.style.display = 'block';
            return;
        }
        
        searchResults.innerHTML = results.map(result => `
            <div class="search-result-item" style="
                padding: 16px 20px;
                border-bottom: 1px solid #f1f5f9;
                cursor: pointer;
                transition: background 0.2s ease;
            " onmouseover="this.style.background='#f8fafc'" onmouseout="this.style.background='white'">
                <div style="font-weight: 600; color: #667eea; margin-bottom: 4px; font-size: 0.875em;">${result.title}</div>
                <div style="color: #64748b; font-size: 0.875em;">${result.text}...</div>
            </div>
        `).join('');
        
        searchResults.style.display = 'block';
        
        // Add click handlers
        document.querySelectorAll('.search-result-item').forEach((item, index) => {
            item.addEventListener('click', () => {
                results[index].element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                results[index].element.style.backgroundColor = '#fef3c7';
                setTimeout(() => {
                    results[index].element.style.backgroundColor = '';
                }, 2000);
                hideSearch();
            });
        });
    }
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

// Print button functionality
function addPrintButton() {
    const hero = document.querySelector('.hero');
    if (!hero) return;
    
    const printBtn = document.createElement('button');
    printBtn.innerHTML = `
        <svg fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" style="width: 20px; height: 20px; margin-right: 8px;">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0l.229 2.523a1.125 1.125 0 01-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0021 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 00-1.913-.247M6.34 18H5.25A2.25 2.25 0 013 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 011.913-.247m10.5 0a48.536 48.536 0 00-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5zm-3 0h.008v.008H15V10.5z" />
        </svg>
        Descargar PDF
    `;
    printBtn.style.cssText = `
        margin-top: 20px;
        padding: 12px 24px;
        background: rgba(255, 255, 255, 0.2);
        border: 1px solid rgba(255, 255, 255, 0.3);
        color: white;
        border-radius: 8px;
        cursor: pointer;
        font-size: 1em;
        font-weight: 600;
        transition: all 0.2s ease;
        display: inline-flex;
        align-items: center;
    `;
    
    printBtn.addEventListener('click', () => window.print());
    printBtn.addEventListener('mouseenter', () => {
        printBtn.style.background = 'rgba(255, 255, 255, 0.3)';
    });
    printBtn.addEventListener('mouseleave', () => {
        printBtn.style.background = 'rgba(255, 255, 255, 0.2)';
    });
    
    hero.appendChild(printBtn);
}

// Initialize print button
document.addEventListener('DOMContentLoaded', addPrintButton);

console.log('✓ AtheOneDam Staff Guide loaded successfully');
