// App State
let currentFiles = [];
let selectedFiles = [];
let analysisResults = null;
let currentEditingFileId = null;

// Pagination for results table
let currentResultsPage = 1;
let resultsPerPage = 50;
let isRenderingResults = false;

// DOM Elements
const elements = {
  // Theme
  themeToggleBtn: document.getElementById('theme-toggle-btn'),
  
  // Sidebar
  sidebar: document.getElementById('sidebar'),
  sidebarToggle: document.getElementById('sidebar-toggle'),
  mobileOverlay: document.getElementById('mobile-overlay'),
  navItems: document.querySelectorAll('.nav-link'),
  modeText: document.querySelector('.mode-text'),
  
  // Scroll to Top
  scrollToTopBtn: document.getElementById('scroll-to-top'),
  
  // File Management
  dropZone: document.getElementById('drop-zone'),
  selectFilesBtn: document.getElementById('select-files-btn'),
  browseFilesBtn: document.getElementById('browse-files'),
  deleteAllBtn: document.getElementById('delete-all-btn'),
  filesContainer: document.getElementById('files-container'),
  filesCount: document.getElementById('files-count'),
  emptyState: document.getElementById('empty-state'),
  
  // File Management Pagination
  fileManagementPagination: document.getElementById('file-management-pagination'),
  fileFirstPage: document.getElementById('file-first-page'),
  filePrevPage: document.getElementById('file-prev-page'),
  fileNextPage: document.getElementById('file-next-page'),
  fileLastPage: document.getElementById('file-last-page'),
  filePageInput: document.getElementById('file-page-input'),
  fileTotalPages: document.getElementById('file-total-pages'),
  filePageInfo: document.getElementById('file-page-info'),
  
  // File Search
  fileSearchInput: document.getElementById('file-search-input'),
  clearFileSearch: document.getElementById('clear-file-search'),
  
  // Analysis
  fileSelectionBody: document.getElementById('file-selection-body'),
  fileSearch: document.getElementById('file-search'),
  selectedCount: document.getElementById('selected-count'),
  selectAllCheckbox: document.getElementById('select-all-checkbox'),
  filePagination: document.getElementById('file-pagination'),
  prevPage: document.getElementById('prev-page'),
  nextPage: document.getElementById('next-page'),
  pageInfo: document.getElementById('page-info'),
  analyzeBtn: document.getElementById('analyze-btn'),
  clearSelectionBtn: document.getElementById('clear-selection-btn'),
  resultsSection: document.getElementById('results-section'),
  resultsSummary: document.getElementById('results-summary'),
  resultsTable: document.getElementById('results-table'),
  resultsTbody: document.getElementById('results-tbody'),
  analysisLoading: document.getElementById('analysis-loading'),
  sortBy: document.getElementById('sort-by'),
  resultsPagination: document.getElementById('results-pagination'),
  resultsFirstPage: document.getElementById('results-first-page'),
  resultsPrevPage: document.getElementById('results-prev-page'),
  resultsNextPage: document.getElementById('results-next-page'),
  resultsLastPage: document.getElementById('results-last-page'),
  pageInput: document.getElementById('page-input'),
  totalPages: document.getElementById('total-pages'),
  resultsPageInfo: document.getElementById('results-page-info'),
  pageSize: document.getElementById('page-size'),
  
  // Top pagination controls
  topResultsFirstPage: document.getElementById('top-results-first-page'),
  topResultsPrevPage: document.getElementById('top-results-prev-page'),
  topResultsNextPage: document.getElementById('top-results-next-page'),
  topResultsLastPage: document.getElementById('top-results-last-page'),
  topPageInfo: document.getElementById('top-page-info'),
  
  // Modal
  modalOverlay: document.getElementById('modal-overlay'),
  fileTagsModal: document.getElementById('file-tags-modal'),
  fileTagsInput: document.getElementById('file-tags-input'),
  modalClose: document.getElementById('modal-close'),
  modalCancel: document.getElementById('modal-cancel'),
  modalSave: document.getElementById('modal-save'),
  
  // Confirm Dialog
  confirmOverlay: document.getElementById('confirm-overlay'),
  confirmDialog: document.getElementById('confirm-dialog'),
  confirmTitle: document.getElementById('confirm-title'),
  confirmMessage: document.getElementById('confirm-message'),
  confirmClose: document.getElementById('confirm-close'),
  confirmCancel: document.getElementById('confirm-cancel'),
  confirmOk: document.getElementById('confirm-ok'),
  
  
  // Settings
  manualCheckUpdate: document.getElementById('manual-check-update'),
  updateStatusText: document.getElementById('update-status-text'),
  statusDot: document.getElementById('status-dot'),
  statusText: document.getElementById('status-text'),
  updateInfo: document.getElementById('update-info'),
  updateDetails: document.getElementById('update-details'),
  updateActions: document.getElementById('update-actions'),
  downloadUpdateBtn: document.getElementById('download-update-btn'),
  installUpdateBtn: document.getElementById('install-update-btn'),
  currentVersion: document.getElementById('current-version'),
  lastCheckTime: document.getElementById('last-check-time'),
  toggleDebugConsole: document.getElementById('toggle-debug-console'),
  
  // Tab contents
  tabContents: document.querySelectorAll('.tab-content')
};

// Pagination state
let currentPage = 1;
let itemsPerPage = 10;
let filteredFiles = [];

// File Management Pagination
let currentFilePage = 1;
let filesPerPage = 12; // Show 12 files per page for better grid layout
let fileSearchQuery = ''; // Store search query for file search


// Initialize App
document.addEventListener('DOMContentLoaded', async () => {
  console.log('🚀 [RENDERER] App initializing...');
  console.log('🚀 [RENDERER] electronAPI available:', !!window.electronAPI);
  console.log('🚀 [RENDERER] electronAPI methods:', window.electronAPI ? Object.keys(window.electronAPI) : 'none');
  
  // Set initial theme from localStorage FIRST
  const savedTheme = localStorage.getItem('theme') || 'light';
  console.log('Saved theme:', savedTheme);
  setTheme(savedTheme);
  
  initializeEventListeners();
  
  // Load files immediately on startup
  console.log('Loading files...');
  await loadFiles();
  
  // Ensure files are displayed on the current tab
  const activeTab = document.querySelector('.tab-content.active');
  if (activeTab && activeTab.id === 'file-management') {
    console.log('Rendering files for file-management tab');
    renderFiles();
    updateFilesCount();
  }
  
  console.log('App initialization complete');
});

// Event Listeners
function initializeEventListeners() {
  // Theme toggle
  elements.themeToggleBtn.addEventListener('click', toggleTheme);
  
  // Sidebar
  elements.sidebarToggle.addEventListener('click', toggleSidebar);
  elements.navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      switchTab(item.dataset.tab);
    });
  });
  
  // File Management
  console.log('🔧 [RENDERER] Setting up file management event listeners...');
  setupDropZone();
  
  if (elements.selectFilesBtn) {
    console.log('✅ [RENDERER] Setting up select files button');
    elements.selectFilesBtn.addEventListener('click', selectFiles);
  } else {
    console.error('❌ [RENDERER] Select files button not found!');
  }
  
  if (elements.browseFilesBtn) {
    console.log('✅ [RENDERER] Setting up browse files button');
    elements.browseFilesBtn.addEventListener('click', selectFiles);
  } else {
    console.error('❌ [RENDERER] Browse files button not found!');
  }
  
  if (elements.deleteAllBtn) {
    console.log('✅ [RENDERER] Setting up delete all button');
    elements.deleteAllBtn.addEventListener('click', deleteAllFiles);
  } else {
    console.error('❌ [RENDERER] Delete all button not found!');
  }
  
  // Analysis
  console.log('🔧 [RENDERER] Setting up analysis event listeners...');
  if (elements.analyzeBtn) {
    console.log('✅ [RENDERER] Setting up analyze button event listener');
    elements.analyzeBtn.addEventListener('click', (e) => {
      console.log('🔍 [RENDERER] === ANALYZE BUTTON CLICKED ===');
      console.log('🔍 [RENDERER] Event:', e);
      console.log('🔍 [RENDERER] Button disabled:', elements.analyzeBtn.disabled);
      console.log('🔍 [RENDERER] Selected files at click time:', selectedFiles);
      analyzeFiles();
    });
  } else {
    console.error('❌ [RENDERER] Analyze button not found!');
  }
  if (elements.clearSelectionBtn) {
    console.log('✅ [RENDERER] Setting up clear selection button event listener');
    elements.clearSelectionBtn.addEventListener('click', (e) => {
      console.log('🧹 [RENDERER] === CLEAR SELECTION BUTTON CLICKED ===');
      console.log('🧹 [RENDERER] Event:', e);
      console.log('🧹 [RENDERER] Selected files before clear:', selectedFiles);
      clearSelection();
    });
  } else {
    console.error('❌ [RENDERER] Clear selection button not found!');
  }
  if (elements.sortBy) {
    elements.sortBy.addEventListener('change', sortResults);
  }
  
  // Results pagination
  if (elements.resultsFirstPage) {
    elements.resultsFirstPage.addEventListener('click', () => changeResultsPage(1));
  }
  if (elements.resultsPrevPage) {
    elements.resultsPrevPage.addEventListener('click', () => changeResultsPage(currentResultsPage - 1));
  }
  if (elements.resultsNextPage) {
    elements.resultsNextPage.addEventListener('click', () => changeResultsPage(currentResultsPage + 1));
  }
  if (elements.resultsLastPage) {
    elements.resultsLastPage.addEventListener('click', () => {
      if (analysisResults && analysisResults.wallets) {
        const totalPages = Math.ceil(analysisResults.wallets.length / resultsPerPage);
        changeResultsPage(totalPages);
      }
    });
  }
  
  // Top pagination controls
  if (elements.topResultsFirstPage) {
    elements.topResultsFirstPage.addEventListener('click', () => changeResultsPage(1));
  }
  if (elements.topResultsPrevPage) {
    elements.topResultsPrevPage.addEventListener('click', () => changeResultsPage(currentResultsPage - 1));
  }
  if (elements.topResultsNextPage) {
    elements.topResultsNextPage.addEventListener('click', () => changeResultsPage(currentResultsPage + 1));
  }
  if (elements.topResultsLastPage) {
    elements.topResultsLastPage.addEventListener('click', () => {
      if (analysisResults && analysisResults.wallets) {
        const totalPages = Math.ceil(analysisResults.wallets.length / resultsPerPage);
        changeResultsPage(totalPages);
      }
    });
  }
  if (elements.pageInput) {
    elements.pageInput.addEventListener('change', (e) => {
      const page = parseInt(e.target.value);
      if (analysisResults && analysisResults.wallets) {
        const totalPages = Math.ceil(analysisResults.wallets.length / resultsPerPage);
        if (page && page > 0 && page <= totalPages) {
          changeResultsPage(page);
        } else {
          // Reset to current page if invalid
          e.target.value = currentResultsPage;
        }
      }
    });
    
    // Also handle Enter key
    elements.pageInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        e.target.blur(); // Trigger change event
      }
    });
  }
  if (elements.pageSize) {
    elements.pageSize.addEventListener('change', (e) => {
      resultsPerPage = parseInt(e.target.value);
      currentResultsPage = 1;
      renderResultsTable();
    });
  }
  
  // File search and pagination
  if (elements.fileSearch) {
    elements.fileSearch.addEventListener('input', handleFileSearch);
  }
  if (elements.selectAllCheckbox) {
    elements.selectAllCheckbox.addEventListener('change', handleSelectAll);
  }
  if (elements.prevPage) {
    elements.prevPage.addEventListener('click', () => changePage(-1));
  }
  if (elements.nextPage) {
    elements.nextPage.addEventListener('click', () => changePage(1));
  }
  
  // Modal
  if (elements.modalClose) {
    elements.modalClose.addEventListener('click', closeModal);
  }
  if (elements.modalCancel) {
    elements.modalCancel.addEventListener('click', closeModal);
  }
  if (elements.modalSave) {
    elements.modalSave.addEventListener('click', saveFileTags);
  }
  if (elements.modalOverlay) {
    elements.modalOverlay.addEventListener('click', (e) => {
      if (e.target === elements.modalOverlay) closeModal();
    });
  }
  
  // Confirm Dialog
  if (elements.confirmClose) {
    elements.confirmClose.addEventListener('click', closeConfirmDialog);
  }
  if (elements.confirmCancel) {
    elements.confirmCancel.addEventListener('click', closeConfirmDialog);
  }
  if (elements.confirmOverlay) {
    elements.confirmOverlay.addEventListener('click', (e) => {
      if (e.target === elements.confirmOverlay) closeConfirmDialog();
    });
  }
  
  
  // Settings
  if (elements.manualCheckUpdate) {
    elements.manualCheckUpdate.addEventListener('click', manualCheckForUpdates);
  }
  if (elements.downloadUpdateBtn) {
    elements.downloadUpdateBtn.addEventListener('click', downloadUpdate);
  }
  if (elements.installUpdateBtn) {
    elements.installUpdateBtn.addEventListener('click', installUpdate);
  }
  
  // Scroll to Top
  if (elements.scrollToTopBtn) {
    elements.scrollToTopBtn.addEventListener('click', scrollToTop);
  }
  
  // Scroll event listener for showing/hiding scroll to top button
  const mainContent = document.querySelector('.main-content');
  if (mainContent) {
    mainContent.addEventListener('scroll', handleScroll);
  } else {
    window.addEventListener('scroll', handleScroll);
  }
  
  // File Management Pagination
  if (elements.fileFirstPage) {
    elements.fileFirstPage.addEventListener('click', () => changeFilePage(1));
  }
  if (elements.filePrevPage) {
    elements.filePrevPage.addEventListener('click', () => changeFilePage(currentFilePage - 1));
  }
  if (elements.fileNextPage) {
    elements.fileNextPage.addEventListener('click', () => changeFilePage(currentFilePage + 1));
  }
  if (elements.fileLastPage) {
    elements.fileLastPage.addEventListener('click', () => {
      const totalPages = Math.ceil(currentFiles.length / filesPerPage);
      changeFilePage(totalPages);
    });
  }
  if (elements.filePageInput) {
    elements.filePageInput.addEventListener('change', (e) => {
      const page = parseInt(e.target.value);
      const totalPages = Math.ceil(currentFiles.length / filesPerPage);
      if (page && page > 0 && page <= totalPages) {
        changeFilePage(page);
      } else {
        e.target.value = currentFilePage;
      }
    });
    
    elements.filePageInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        e.target.blur();
      }
    });
  }
  
  // File Search
  if (elements.fileSearchInput) {
    elements.fileSearchInput.addEventListener('input', (e) => {
      fileSearchQuery = e.target.value.toLowerCase().trim();
      performFileSearch();
    });
  }
  
  if (elements.clearFileSearch) {
    elements.clearFileSearch.addEventListener('click', () => {
      elements.fileSearchInput.value = '';
      fileSearchQuery = '';
      performFileSearch();
    });
  }
}

// Theme Management
let isThemeChanging = false;

function toggleTheme() {
  if (isThemeChanging) return; // Prevent multiple rapid theme changes
  
  isThemeChanging = true;
  const currentTheme = document.body.classList.contains('dark') ? 'dark' : 'light';
  const newTheme = currentTheme === 'light' ? 'dark' : 'light';
  setTheme(newTheme);
}

function setTheme(theme) {
  console.log('Setting theme to:', theme);
  
  // Add animation to both logos
  const lightLogo = document.querySelector('.light-logo');
  const darkLogo = document.querySelector('.dark-logo');
  
  if (lightLogo && darkLogo) {
    lightLogo.classList.add('theme-changing');
    darkLogo.classList.add('theme-changing');
    setTimeout(() => {
      lightLogo.classList.remove('theme-changing');
      darkLogo.classList.remove('theme-changing');
    }, 800);
  }
  
  // Batch all DOM updates for better performance
  const updates = () => {
    // Remove both possible classes first
    document.body.classList.remove('dark', 'light-theme', 'dark-theme');
    
    if (theme === 'dark') {
      document.body.classList.add('dark');
      if (elements.modeText) {
        elements.modeText.innerText = "Light mode";
      }
    } else {
      // Light theme - no class needed as CSS defaults to light
      if (elements.modeText) {
        elements.modeText.innerText = "Dark mode";
      }
    }
    localStorage.setItem('theme', theme);
    
    // Reset theme change lock
    setTimeout(() => {
      isThemeChanging = false;
    }, 100);
  };
  
  // Use requestAnimationFrame for smooth theme switching
  requestAnimationFrame(updates);
}

// Sidebar Management
let isToggling = false;
let sidebarToggleTimeout = null;

function toggleSidebar() {
  if (isToggling) return; // Prevent multiple rapid toggles
  
  // Clear any pending toggle
  if (sidebarToggleTimeout) {
    clearTimeout(sidebarToggleTimeout);
  }
  
  isToggling = true;
  const isMobile = window.innerWidth <= 768;
  
  // Batch DOM updates for better performance
  const updates = () => {
    if (isMobile) {
      const isOpen = elements.sidebar.classList.toggle('open');
      elements.mobileOverlay.style.display = isOpen ? 'block' : 'none';
    } else {
      elements.sidebar.classList.toggle('close');
    }
    
    // Reset toggle lock after animation completes
    sidebarToggleTimeout = setTimeout(() => {
      isToggling = false;
      sidebarToggleTimeout = null;
    }, 250); // Slightly longer to ensure smooth transition
  };
  
  // Use requestAnimationFrame for smooth animations
  requestAnimationFrame(updates);
}

// Handle window resize with debouncing
let resizeTimeout;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    const isMobile = window.innerWidth <= 768;
    
    if (!isMobile) {
      elements.sidebar.classList.remove('open');
      elements.mobileOverlay.style.display = 'none';
    } else {
      elements.sidebar.classList.remove('close');
    }
  }, 100);
});

// Handle mobile overlay click
if (elements.mobileOverlay) {
  elements.mobileOverlay.addEventListener('click', () => {
    elements.sidebar.classList.remove('open');
    elements.mobileOverlay.style.display = 'none';
  });
}

function switchTab(tabId) {
  // Update nav items
  elements.navItems.forEach(item => {
    item.classList.toggle('active', item.dataset.tab === tabId);
  });
  
  // Update tab contents
  elements.tabContents.forEach(content => {
    content.classList.toggle('active', content.id === tabId);
  });
  
  // Load data based on tab
  if (tabId === 'analysis') {
    loadFilesForAnalysis();
  } else if (tabId === 'file-management') {
    // Ensure files are rendered when switching back to file management
    if (currentFiles.length === 0) {
      loadFiles().then(() => {
        renderFiles();
        updateFilesCount();
      });
    } else {
      renderFiles();
      updateFilesCount();
    }
  } else if (tabId === 'settings') {
    loadSettingsData();
  }
}

// File Management
function setupDropZone() {
  elements.dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    elements.dropZone.classList.add('drag-over');
  });
  
  elements.dropZone.addEventListener('dragleave', (e) => {
    e.preventDefault();
    if (!elements.dropZone.contains(e.relatedTarget)) {
      elements.dropZone.classList.remove('drag-over');
    }
  });
  
  elements.dropZone.addEventListener('drop', async (e) => {
    e.preventDefault();
    elements.dropZone.classList.remove('drag-over');
    
    const files = Array.from(e.dataTransfer.files);
    const csvFiles = files.filter(file => 
      file.name.toLowerCase().endsWith('.csv') || file.type === 'text/csv'
    );
    
    if (csvFiles.length > 0) {
      const filePaths = csvFiles.map(file => file.path);
      await uploadFiles(filePaths);
    } else {
      showNotification('Vui lòng chỉ kéo thả file CSV', 'warning');
    }
  });
  
  // Click vào toàn bộ drop zone để mở file explorer
  elements.dropZone.addEventListener('click', selectFiles);
}

async function selectFiles() {
  console.log('📁 [RENDERER] selectFiles function called');
  try {
    console.log('📁 [RENDERER] Calling electronAPI.showOpenDialog...');
    const filePaths = await window.electronAPI.showOpenDialog();
    console.log('📁 [RENDERER] showOpenDialog result:', filePaths);
    
    if (filePaths && filePaths.length > 0) {
      console.log('📁 [RENDERER] Uploading files:', filePaths);
      await uploadFiles(filePaths);
    } else {
      console.log('📁 [RENDERER] No files selected');
    }
  } catch (error) {
    console.error('❌ [RENDERER] Error selecting files:', error);
    showNotification('Lỗi khi chọn file', 'error');
  }
}

async function uploadFiles(filePaths) {
  try {
    showNotification('Đang upload file...', 'info');
    const result = await window.electronAPI.uploadCSVFiles(filePaths);
    
    if (result.success) {
      showNotification(`Upload thành công ${result.uploadedCount} file`, 'success');
      await loadFiles();
    } else {
      showNotification(result.message, 'error');
    }
  } catch (error) {
    console.error('Error uploading files:', error);
    showNotification('Lỗi khi upload file', 'error');
  }
}

async function loadFiles() {
  try {
    currentFiles = await window.electronAPI.getCSVFiles();
    renderFiles();
    updateFilesCount();
  } catch (error) {
    console.error('Error loading files:', error);
    showNotification('Lỗi khi tải danh sách file', 'error');
  }
}

function renderFiles() {
  // Get files to display (filtered or all)
  const filesToDisplay = fileSearchQuery ? getFilteredFiles() : currentFiles;
  
  if (filesToDisplay.length === 0) {
    if (fileSearchQuery) {
      elements.filesContainer.innerHTML = `
        <div class="empty-state">
          <i class="fas fa-search"></i>
          <h3>Không tìm thấy file nào</h3>
          <p>Không có file nào khớp với từ khóa "${fileSearchQuery}"</p>
        </div>
      `;
    } else {
      elements.filesContainer.innerHTML = `
        <div class="empty-state">
          <i class="fas fa-file-csv"></i>
          <h3>Chưa có file nào</h3>
          <p>Hãy kéo thả hoặc chọn file CSV để bắt đầu</p>
        </div>
      `;
    }
    // Hide pagination when no files
    if (elements.fileManagementPagination) {
      elements.fileManagementPagination.style.display = 'none';
    }
    return;
  }
  
  // Calculate pagination
  const totalPages = Math.ceil(filesToDisplay.length / filesPerPage);
  const startIndex = (currentFilePage - 1) * filesPerPage;
  const endIndex = startIndex + filesPerPage;
  const pageFiles = filesToDisplay.slice(startIndex, endIndex);
  
  // Render only current page files
  const filesHTML = pageFiles.map(file => `
    <div class="file-card" data-file-id="${file.id}">
      <div class="file-header">
        <div class="file-info">
          <div class="file-icon">
            <i class="fas fa-file-csv"></i>
          </div>
          <div class="file-details">
            <h3>${escapeHtml(file.filename)}</h3>
            <div class="file-meta">
              <span><i class="fas fa-calendar"></i> ${formatDate(file.uploadDate)}</span>
              <span><i class="fas fa-weight"></i> ${formatFileSize(file.size)}</span>
            </div>
          </div>
        </div>
        <div class="file-actions">
          <button class="btn btn-sm btn-secondary" onclick="editFileTags(${file.id})">
            <i class="fas fa-tag"></i>
          </button>
          <button class="btn btn-sm btn-success" onclick="downloadFile(${file.id})">
            <i class="fas fa-download"></i>
          </button>
          <button class="btn btn-sm btn-danger" onclick="deleteFile(${file.id})">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </div>
      <div class="file-tags">
        <div class="file-tags-label">Tags:</div>
        <div class="tags-container">
          ${renderTags(file.tags)}
        </div>
      </div>
    </div>
  `).join('');
  
  elements.filesContainer.innerHTML = filesHTML;
  
  // Update pagination
  updateFilePagination(totalPages, filesToDisplay.length);
}

function renderTags(tags) {
  if (!tags || tags.trim() === '') {
    return '<span class="empty-tags">Chưa có tag</span>';
  }
  
  return tags.split(',').map(tag => 
    `<span class="tag">${escapeHtml(tag.trim())}</span>`
  ).join('');
}

function updateFilesCount() {
  const filesToDisplay = fileSearchQuery ? getFilteredFiles() : currentFiles;
  elements.filesCount.textContent = `${filesToDisplay.length} file${filesToDisplay.length !== 1 ? 's' : ''}`;
}

function getFilteredFiles() {
  if (!fileSearchQuery) return currentFiles;
  
  return currentFiles.filter(file => 
    file.filename.toLowerCase().includes(fileSearchQuery)
  );
}

function performFileSearch() {
  // Reset to first page when searching
  currentFilePage = 1;
  
  // Update clear button visibility
  if (elements.clearFileSearch) {
    elements.clearFileSearch.style.display = fileSearchQuery ? 'flex' : 'none';
  }
  
  // Re-render files with search results
  renderFiles();
  updateFilesCount();
}

function changeFilePage(newPage) {
  const filesToDisplay = fileSearchQuery ? getFilteredFiles() : currentFiles;
  const totalPages = Math.ceil(filesToDisplay.length / filesPerPage);
  if (newPage >= 1 && newPage <= totalPages) {
    currentFilePage = newPage;
    renderFiles();
  }
}

function updateFilePagination(totalPages, totalFiles) {
  if (!elements.fileManagementPagination) return;
  
  // Show/hide pagination based on total pages
  if (totalPages <= 1) {
    elements.fileManagementPagination.style.display = 'none';
    return;
  }
  
  elements.fileManagementPagination.style.display = 'block';
  
  // Update all navigation buttons
  if (elements.fileFirstPage) {
    elements.fileFirstPage.disabled = currentFilePage <= 1;
  }
  if (elements.filePrevPage) {
    elements.filePrevPage.disabled = currentFilePage <= 1;
  }
  if (elements.fileNextPage) {
    elements.fileNextPage.disabled = currentFilePage >= totalPages;
  }
  if (elements.fileLastPage) {
    elements.fileLastPage.disabled = currentFilePage >= totalPages;
  }
  
  // Update page input
  if (elements.filePageInput) {
    elements.filePageInput.value = currentFilePage;
    elements.filePageInput.max = totalPages;
  }
  
  // Update total pages display
  if (elements.fileTotalPages) {
    elements.fileTotalPages.textContent = `/ ${totalPages}`;
  }
  
  // Update page info
  if (elements.filePageInfo) {
    const startIndex = (currentFilePage - 1) * filesPerPage + 1;
    const endIndex = Math.min(currentFilePage * filesPerPage, totalFiles);
    elements.filePageInfo.textContent = `Hiển thị ${startIndex}-${endIndex} của ${totalFiles} file`;
  }
}

async function deleteFile(fileId) {
  const confirmed = await showConfirmDialog(
    'Xóa file',
    'Bạn có chắc muốn xóa file này? Hành động này không thể hoàn tác.'
  );
  
  if (!confirmed) return;
  
  try {
    const success = await window.electronAPI.deleteCSVFile(fileId);
    if (success) {
      showNotification('Xóa file thành công', 'success');
      // Reset search and pagination
      fileSearchQuery = '';
      if (elements.fileSearchInput) elements.fileSearchInput.value = '';
      if (elements.clearFileSearch) elements.clearFileSearch.style.display = 'none';
      currentFilePage = 1;
      
      await loadFiles();
      // Also update analysis tab if needed
      if (selectedFiles.includes(fileId)) {
        selectedFiles = selectedFiles.filter(id => id !== fileId);
      }
    } else {
      showNotification('Lỗi khi xóa file', 'error');
    }
  } catch (error) {
    console.error('Error deleting file:', error);
    showNotification('Lỗi khi xóa file', 'error');
  }
}

async function deleteAllFiles() {
  const confirmed = await showConfirmDialog(
    'Xóa tất cả file',
    'Bạn có chắc muốn xóa tất cả file? Hành động này không thể hoàn tác.'
  );
  
  if (!confirmed) return;
  
  try {
    const success = await window.electronAPI.deleteAllCSVFiles();
    if (success) {
      showNotification('Xóa tất cả file thành công', 'success');
      // Reset search and pagination
      fileSearchQuery = '';
      if (elements.fileSearchInput) elements.fileSearchInput.value = '';
      if (elements.clearFileSearch) elements.clearFileSearch.style.display = 'none';
      currentFilePage = 1;
      
      await loadFiles();
      selectedFiles = []; // Clear selection
    } else {
      showNotification('Lỗi khi xóa file', 'error');
    }
  } catch (error) {
    console.error('Error deleting all files:', error);
    showNotification('Lỗi khi xóa file', 'error');
  }
}

async function downloadFile(fileId) {
  try {
    const success = await window.electronAPI.downloadCSVFile(fileId);
    if (success) {
      showNotification('Tải file thành công', 'success');
    } else {
      showNotification('Lỗi khi tải file', 'error');
    }
  } catch (error) {
    console.error('Error downloading file:', error);
    showNotification('Lỗi khi tải file', 'error');
  }
}

// File Tags Management
function editFileTags(fileId) {
  console.log('editFileTags called with fileId:', fileId);
  const file = currentFiles.find(f => f.id === fileId);
  if (!file) return;
  
  currentEditingFileId = fileId;
  if (elements.fileTagsInput) {
    elements.fileTagsInput.value = file.tags || '';
  }
  if (elements.modalOverlay) {
    elements.modalOverlay.classList.add('active');
  }
}

function closeModal() {
  console.log('closeModal called');
  if (elements.modalOverlay) {
    elements.modalOverlay.classList.remove('active');
  }
  currentEditingFileId = null;
  if (elements.fileTagsInput) {
    elements.fileTagsInput.value = '';
  }
}

async function saveFileTags() {
  console.log('saveFileTags called, currentEditingFileId:', currentEditingFileId);
  if (!currentEditingFileId) return;
  
  try {
    const tags = elements.fileTagsInput ? elements.fileTagsInput.value.trim() : '';
    console.log('Saving tags:', tags);
    const success = await window.electronAPI.updateFileTags(currentEditingFileId, tags);
    
    if (success) {
      showNotification('Cập nhật tags thành công', 'success');
      await loadFiles();
      closeModal();
    } else {
      showNotification('Lỗi khi cập nhật tags', 'error');
    }
  } catch (error) {
    console.error('Error updating tags:', error);
    showNotification('Lỗi khi cập nhật tags', 'error');
  }
}

// Confirm Dialog Functions
function showConfirmDialog(title, message) {
  return new Promise((resolve) => {
    if (elements.confirmTitle) elements.confirmTitle.textContent = title;
    if (elements.confirmMessage) elements.confirmMessage.textContent = message;
    if (elements.confirmOverlay) elements.confirmOverlay.classList.add('active');
    
    // Remove existing listeners
    if (elements.confirmOk) {
      const newOkButton = elements.confirmOk.cloneNode(true);
      elements.confirmOk.parentNode.replaceChild(newOkButton, elements.confirmOk);
      elements.confirmOk = newOkButton;
      
      elements.confirmOk.addEventListener('click', () => {
        closeConfirmDialog();
        resolve(true);
      });
    }
  });
}

function closeConfirmDialog() {
  if (elements.confirmOverlay) {
    elements.confirmOverlay.classList.remove('active');
  }
}


// Expose functions to global scope for onclick handlers
window.editFileTags = editFileTags;
window.deleteFile = deleteFile;
window.downloadFile = downloadFile;
window.toggleFileSelection = toggleFileSelection;
window.copyToClipboard = copyToClipboard;
window.openExternalLink = openExternalLink;

// Analysis
async function loadFilesForAnalysis() {
  if (currentFiles.length === 0) {
    await loadFiles();
  }
  renderFileSelection();
}

function renderFileSelection() {
  if (currentFiles.length === 0) {
    elements.fileSelectionBody.innerHTML = `
      <div class="empty-state">
        <i class="fas fa-file-csv"></i>
        <p>Không có file nào để chọn. Hãy upload file ở tab "Quản lý File" trước.</p>
      </div>
    `;
    elements.filePagination.style.display = 'none';
    return;
  }
  
  // Apply search filter
  applySearchFilter();
  
  // Calculate pagination
  const totalPages = Math.ceil(filteredFiles.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPageFiles = filteredFiles.slice(startIndex, endIndex);
  
  // Render table rows
  const filesHTML = currentPageFiles.map(file => `
    <div class="table-row ${selectedFiles.includes(file.id) ? 'selected' : ''}" data-file-id="${file.id}">
      <div class="table-cell checkbox-cell">
        <input type="checkbox" 
               ${selectedFiles.includes(file.id) ? 'checked' : ''} 
               ${selectedFiles.length >= 10 && !selectedFiles.includes(file.id) ? 'disabled' : ''}
               onchange="toggleFileSelection(${file.id})">
      </div>
      <div class="table-cell">
        <div class="file-name">
          <i class="fas fa-file-csv"></i>
          ${escapeHtml(file.filename)}
        </div>
      </div>
      <div class="table-cell">
        <div class="file-tags-display">
          ${renderFileTagsForTable(file.tags)}
        </div>
      </div>
      <div class="table-cell file-size">
        ${formatFileSize(file.size)}
      </div>
      <div class="table-cell file-date">
        ${formatDate(file.uploadDate)}
      </div>
    </div>
  `).join('');
  
  elements.fileSelectionBody.innerHTML = filesHTML;
  
  // Update pagination
  updatePagination(totalPages);
  updateSelectedCount();
  updateAnalyzeButton();
  updateSelectAllCheckbox();
}

function toggleFileSelection(fileId) {
  console.log('=== TOGGLE FILE SELECTION ===');
  console.log('fileId:', fileId);
  console.log('selectedFiles before:', selectedFiles);
  
  const isSelected = selectedFiles.includes(fileId);
  console.log('isSelected:', isSelected);
  
  if (isSelected) {
    selectedFiles = selectedFiles.filter(id => id !== fileId);
    console.log('Removed file from selection');
  } else if (selectedFiles.length < 10) {
    selectedFiles.push(fileId);
    console.log('Added file to selection');
  } else {
    console.log('Max files reached');
    showNotification('Tối đa chỉ được chọn 10 file', 'warning');
    return;
  }
  
  console.log('selectedFiles after:', selectedFiles);
  renderFileSelection();
  console.log('renderFileSelection completed for toggle');
}

function clearSelection() {
  console.log('=== CLEAR SELECTION FUNCTION CALLED ===');
  console.log('Selected files before clear:', selectedFiles);
  selectedFiles = [];
  console.log('Selected files after clear:', selectedFiles);
  renderFileSelection();
  console.log('renderFileSelection completed');
}

// Helper functions for new table interface
function applySearchFilter() {
  const searchTerm = elements.fileSearch ? elements.fileSearch.value.toLowerCase() : '';
  filteredFiles = currentFiles.filter(file => 
    file.filename.toLowerCase().includes(searchTerm) ||
    (file.tags && file.tags.toLowerCase().includes(searchTerm))
  );
}

function renderFileTagsForTable(tags) {
  if (!tags || tags.trim() === '') {
    return '<span class="empty-tags">Không có tag</span>';
  }
  return tags.split(',').map(tag => 
    `<span class="tag">${escapeHtml(tag.trim())}</span>`
  ).join('');
}

function updatePagination(totalPages) {
  if (totalPages <= 1) {
    elements.filePagination.style.display = 'none';
    return;
  }
  
  elements.filePagination.style.display = 'flex';
  elements.pageInfo.textContent = `Trang ${currentPage} / ${totalPages}`;
  elements.prevPage.disabled = currentPage === 1;
  elements.nextPage.disabled = currentPage === totalPages;
}

function updateSelectedCount() {
  if (elements.selectedCount) {
    elements.selectedCount.textContent = `${selectedFiles.length}/10 file đã chọn`;
  }
}

function updateSelectAllCheckbox() {
  if (!elements.selectAllCheckbox) return;
  
  const visibleFileIds = filteredFiles.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  ).map(file => file.id);
  
  const allVisibleSelected = visibleFileIds.length > 0 && 
    visibleFileIds.every(id => selectedFiles.includes(id));
  
  elements.selectAllCheckbox.checked = allVisibleSelected;
  elements.selectAllCheckbox.indeterminate = 
    !allVisibleSelected && visibleFileIds.some(id => selectedFiles.includes(id));
}

function handleFileSearch() {
  currentPage = 1; // Reset to first page when searching
  renderFileSelection();
}

function handleSelectAll() {
  const isChecked = elements.selectAllCheckbox.checked;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const visibleFiles = filteredFiles.slice(startIndex, endIndex);
  const visibleFileIds = visibleFiles.map(file => file.id);
  
  if (isChecked) {
    // Add all visible files to selection (up to limit)
    visibleFileIds.forEach(id => {
      if (!selectedFiles.includes(id) && selectedFiles.length < 10) {
        selectedFiles.push(id);
      }
    });
  } else {
    // Remove all visible files from selection
    selectedFiles = selectedFiles.filter(id => !visibleFileIds.includes(id));
  }
  
  renderFileSelection();
}

function changePage(direction) {
  const totalPages = Math.ceil(filteredFiles.length / itemsPerPage);
  const newPage = currentPage + direction;
  
  if (newPage >= 1 && newPage <= totalPages) {
    currentPage = newPage;
    renderFileSelection();
  }
}

function updateAnalyzeButton() {
  elements.analyzeBtn.disabled = selectedFiles.length === 0;
}

async function analyzeFiles() {
  console.log('=== ANALYZE FILES FUNCTION CALLED ===');
  console.log('analyzeFiles called, selectedFiles:', selectedFiles);
  console.log('selectedFiles.length:', selectedFiles.length);
  
  if (selectedFiles.length === 0) {
    console.log('No files selected - returning early');
    showNotification('Vui lòng chọn ít nhất 1 file để phân tích', 'warning');
    return;
  }
  
  try {
    console.log('Starting analysis...');
    
    // Check if elements exist
    console.log('analysisLoading element:', elements.analysisLoading);
    console.log('resultsSection element:', elements.resultsSection);
    
    if (elements.analysisLoading) {
      elements.analysisLoading.style.display = 'block';
    }
    if (elements.resultsSection) {
      elements.resultsSection.style.display = 'none';
    }
    
    console.log('Calling electronAPI.analyzeCSVFiles with:', selectedFiles);
    console.log('window.electronAPI:', window.electronAPI);
    
    if (!window.electronAPI || !window.electronAPI.analyzeCSVFiles) {
      throw new Error('electronAPI.analyzeCSVFiles is not available');
    }
    
    analysisResults = await window.electronAPI.analyzeCSVFiles(selectedFiles);
    console.log('Analysis results received:', analysisResults);
    
    if (elements.analysisLoading) {
      elements.analysisLoading.style.display = 'none';
    }
    if (elements.resultsSection) {
      elements.resultsSection.style.display = 'block';
    }
    
    renderAnalysisResults();
    showNotification(`Phân tích thành công ${analysisResults.totalWallets} ví từ ${analysisResults.totalFiles} file`, 'success');
    
  } catch (error) {
    console.error('Error analyzing files:', error);
    if (elements.analysisLoading) {
      elements.analysisLoading.style.display = 'none';
    }
    showNotification(`Lỗi khi phân tích file: ${error.message}`, 'error');
  }
}

function renderAnalysisResults() {
  if (!analysisResults) return;
  
  // Update summary
  elements.resultsSummary.innerHTML = `
    <div class="summary-item">
      <i class="fas fa-file"></i>
      <span>${analysisResults.totalFiles} file đã phân tích</span>
    </div>
    <div class="summary-item">
      <i class="fas fa-wallet"></i>
      <span>${analysisResults.totalWallets} ví tổng cộng</span>
    </div>
    <div class="summary-item">
      <i class="fas fa-copy"></i>
      <span>${analysisResults.duplicateWallets} ví trùng lặp</span>
    </div>
  `;
  
  // Show scroll to top button when results are available
  if (elements.scrollToTopBtn) {
    elements.scrollToTopBtn.classList.add('show');
  }
  
  // Render table
  renderResultsTable();
}

function renderResultsTable() {
  if (!analysisResults || !analysisResults.wallets || isRenderingResults) return;
  
  isRenderingResults = true;
  
  // Use requestAnimationFrame to prevent blocking
  requestAnimationFrame(() => {
    try {
      let wallets = [...analysisResults.wallets];
      
      // Apply sorting
      const sortBy = elements.sortBy.value;
      switch (sortBy) {
        case 'transactions-desc':
          wallets.sort((a, b) => b.totalTransactions - a.totalTransactions);
          break;
        case 'transactions-asc':
          wallets.sort((a, b) => a.totalTransactions - b.totalTransactions);
          break;
        case 'time-asc':
          wallets.sort((a, b) => new Date(a.earliestTransaction) - new Date(b.earliestTransaction));
          break;
        case 'time-desc':
          wallets.sort((a, b) => new Date(b.latestTransaction) - new Date(a.latestTransaction));
          break;
        case 'frequency-desc':
          wallets.sort((a, b) => b.filesAppeared.length - a.filesAppeared.length);
          break;
        case 'frequency-asc':
          wallets.sort((a, b) => a.filesAppeared.length - b.filesAppeared.length);
          break;
      }
      
      // Calculate pagination
      const totalPages = Math.ceil(wallets.length / resultsPerPage);
      const startIndex = (currentResultsPage - 1) * resultsPerPage;
      const endIndex = Math.min(startIndex + resultsPerPage, wallets.length);
      const pageWallets = wallets.slice(startIndex, endIndex);
      
      // Update pagination controls
      updateResultsPagination(totalPages);
      
      // Render only current page
      const tableHTML = pageWallets.map((wallet, index) => {
        const globalIndex = startIndex + index;
        return `
          <tr>
            <td>${globalIndex + 1}</td>
            <td>
              <div class="wallet-address" title="Click để copy: ${wallet.address}" onclick="copyToClipboard('${wallet.address}')">
                ${formatWalletAddress(wallet.address)}
              </div>
            </td>
            <td>
              <span class="transaction-count">${wallet.totalTransactions}</span>
            </td>
            <td>
              <div class="file-list" title="${wallet.filesAppeared.join(', ')}">
                ${wallet.filesAppeared.join(', ')}
              </div>
            </td>
            <td>${formatDateTime(wallet.earliestTransaction)}</td>
            <td>${formatDateTime(wallet.latestTransaction)}</td>
            <td>
              <div class="action-buttons">
                <button class="action-btn solscan" onclick="openExternalLink('https://solscan.io/account/${wallet.address}')">
                  <i class="fas fa-external-link-alt"></i>
                  Solscan
                </button>
                <button class="action-btn gmgn" onclick="openExternalLink('https://gmgn.ai/sol/address/${wallet.address}')">
                  <i class="fas fa-external-link-alt"></i>
                  GMGN
                </button>
              </div>
            </td>
          </tr>
        `;
      }).join('');
      
      elements.resultsTbody.innerHTML = tableHTML;
      
    } finally {
      isRenderingResults = false;
    }
  });
}

function sortResults() {
  currentResultsPage = 1; // Reset to first page when sorting
  renderResultsTable();
}

function changeResultsPage(newPage) {
  if (!analysisResults || !analysisResults.wallets) return;
  
  const totalPages = Math.ceil(analysisResults.wallets.length / resultsPerPage);
  if (newPage >= 1 && newPage <= totalPages) {
    currentResultsPage = newPage;
    renderResultsTable();
  }
}

function updateResultsPagination(totalPages) {
  if (!elements.resultsPagination) return;
  
  // Show/hide pagination based on total pages
  if (totalPages <= 1) {
    elements.resultsPagination.style.display = 'none';
    return;
  }
  
  elements.resultsPagination.style.display = 'block';
  
  // Update all navigation buttons
  if (elements.resultsFirstPage) {
    elements.resultsFirstPage.disabled = currentResultsPage <= 1;
  }
  if (elements.resultsPrevPage) {
    elements.resultsPrevPage.disabled = currentResultsPage <= 1;
  }
  if (elements.resultsNextPage) {
    elements.resultsNextPage.disabled = currentResultsPage >= totalPages;
  }
  if (elements.resultsLastPage) {
    elements.resultsLastPage.disabled = currentResultsPage >= totalPages;
  }
  
  // Update top pagination controls
  if (elements.topResultsFirstPage) {
    elements.topResultsFirstPage.disabled = currentResultsPage <= 1;
  }
  if (elements.topResultsPrevPage) {
    elements.topResultsPrevPage.disabled = currentResultsPage <= 1;
  }
  if (elements.topResultsNextPage) {
    elements.topResultsNextPage.disabled = currentResultsPage >= totalPages;
  }
  if (elements.topResultsLastPage) {
    elements.topResultsLastPage.disabled = currentResultsPage >= totalPages;
  }
  
  // Update page input
  if (elements.pageInput) {
    elements.pageInput.value = currentResultsPage;
    elements.pageInput.max = totalPages;
  }
  
  // Update total pages display
  if (elements.totalPages) {
    elements.totalPages.textContent = `/ ${totalPages}`;
  }
  
  // Update top page info
  if (elements.topPageInfo) {
    elements.topPageInfo.textContent = `Trang ${currentResultsPage} / ${totalPages}`;
  }
  
  // Update page info
  if (elements.resultsPageInfo && analysisResults) {
    const startIndex = (currentResultsPage - 1) * resultsPerPage + 1;
    const endIndex = Math.min(currentResultsPage * resultsPerPage, analysisResults.wallets.length);
    elements.resultsPageInfo.textContent = `Hiển thị ${startIndex}-${endIndex} của ${analysisResults.wallets.length} ví`;
  }
}

// Utility Functions
function formatWalletAddress(address) {
  if (!address || address.length < 20) return address;
  return `${address.substring(0, 10)}...${address.substring(address.length - 10)}`;
}

async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    showNotification(`Đã copy địa chỉ: ${formatWalletAddress(text)}`, 'success');
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    // Fallback method
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand('copy');
      showNotification(`Đã copy địa chỉ: ${formatWalletAddress(text)}`, 'success');
    } catch (fallbackError) {
      showNotification('Không thể copy địa chỉ', 'error');
    }
    document.body.removeChild(textArea);
  }
}

async function openExternalLink(url) {
  try {
    if (window.electronAPI && window.electronAPI.openExternal) {
      await window.electronAPI.openExternal(url);
    } else {
      // Fallback for web browsers
      window.open(url, '_blank');
    }
  } catch (error) {
    console.error('Failed to open external link:', error);
    showNotification('Không thể mở link', 'error');
  }
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function formatDateTime(dateString) {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
}

function formatFileSize(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

function escapeHtml(unsafe) {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function showNotification(message, type = 'info') {
  // Simple notification - you could enhance this with a toast library
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.textContent = message;
  
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 12px 20px;
    border-radius: 6px;
    color: white;
    font-weight: 500;
    z-index: 9999;
    animation: slideIn 0.3s ease-out;
    max-width: 300px;
  `;
  
  switch (type) {
    case 'success':
      notification.style.backgroundColor = '#10b981';
      break;
    case 'error':
      notification.style.backgroundColor = '#ef4444';
      break;
    case 'warning':
      notification.style.backgroundColor = '#f59e0b';
      break;
    default:
      notification.style.backgroundColor = '#3b82f6';
  }
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease-out';
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 300);
  }, 3000);
}

// Add CSS for notifications
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  
  @keyframes slideOut {
    from { transform: translateX(0); opacity: 1; }
    to { transform: translateX(100%); opacity: 0; }
  }
`;
document.head.appendChild(style);

// Auto-update functionality
let updateInfo = null;

function setupAutoUpdate() {
  // Listen for update events
  if (window.electronAPI) {
    window.electronAPI.onUpdateAvailable((info) => {
      console.log('📦 [RENDERER] Update available:', info);
      updateInfo = info;
      showUpdateNotification();
    });
    
    window.electronAPI.onDownloadProgress((progress) => {
      console.log('📥 [RENDERER] Download progress:', progress.percent);
      updateDownloadProgress(progress.percent);
    });
    
    window.electronAPI.onUpdateDownloaded((info) => {
      console.log('🎉 [RENDERER] Update downloaded:', info);
      showInstallNotification();
    });
  }
}

function showUpdateNotification() {
  const updateItem = document.getElementById('update-item');
  
  if (updateItem) {
    updateItem.style.display = 'flex';
  }
}

function updateDownloadProgress(percent) {
  const updateBtn = document.getElementById('update-btn');
  if (updateBtn) {
    updateBtn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> ${Math.round(percent)}%`;
  }
}

function showInstallNotification() {
  const updateBtn = document.getElementById('update-btn');
  if (updateBtn) {
    updateBtn.innerHTML = '<i class="fas fa-install"></i> Install';
    updateBtn.onclick = installUpdate;
  }
}

async function checkForUpdates() {
  try {
    if (window.electronAPI && window.electronAPI.checkForUpdates) {
      await window.electronAPI.checkForUpdates();
    }
  } catch (error) {
    console.error('Error checking for updates:', error);
  }
}

async function downloadUpdate() {
  try {
    if (window.electronAPI && window.electronAPI.downloadUpdate) {
      await window.electronAPI.downloadUpdate();
    }
  } catch (error) {
    console.error('Error downloading update:', error);
  }
}

async function installUpdate() {
  try {
    if (window.electronAPI && window.electronAPI.installUpdate) {
      await window.electronAPI.installUpdate();
    }
  } catch (error) {
    console.error('Error installing update:', error);
  }
}

// Setup auto-update when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  setupAutoUpdate();
  
  // Check for updates on startup
  setTimeout(() => {
    checkForUpdates();
  }, 5000); // Wait 5 seconds after startup
});

// Settings Functions
function loadSettingsData() {
  console.log('Loading settings data...');
  
  // Set current version
  if (elements.currentVersion) {
    elements.currentVersion.textContent = '1.0.0';
  }
  
  // Set last check time
  const lastCheck = localStorage.getItem('lastUpdateCheck');
  if (elements.lastCheckTime) {
    if (lastCheck) {
      const checkDate = new Date(lastCheck);
      elements.lastCheckTime.textContent = checkDate.toLocaleString('vi-VN');
    } else {
      elements.lastCheckTime.textContent = 'Chưa kiểm tra';
    }
  }
  
  // Reset update status
  updateUpdateStatus('idle', 'Chưa kiểm tra');
}

function updateUpdateStatus(status, text) {
  if (elements.statusDot && elements.statusText) {
    // Remove all status classes
    elements.statusDot.classList.remove('status-checking', 'status-available', 'status-up-to-date', 'status-error');
    
    // Add appropriate class
    elements.statusDot.classList.add(`status-${status}`);
    elements.statusText.textContent = text;
  }
  
  if (elements.updateStatusText) {
    elements.updateStatusText.textContent = text;
  }
}

async function manualCheckForUpdates() {
  console.log('Manual check for updates requested');
  
  if (elements.manualCheckUpdate) {
    elements.manualCheckUpdate.disabled = true;
    elements.manualCheckUpdate.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Đang kiểm tra...';
  }
  
  updateUpdateStatus('checking', 'Đang kiểm tra...');
  
  try {
    if (window.electronAPI && window.electronAPI.checkForUpdates) {
      const result = await window.electronAPI.checkForUpdates();
      console.log('Manual check result:', result);
      
      // Update last check time
      localStorage.setItem('lastUpdateCheck', new Date().toISOString());
      if (elements.lastCheckTime) {
        elements.lastCheckTime.textContent = new Date().toLocaleString('vi-VN');
      }
      
      // The actual update status will be handled by the auto-update event listeners
      // This is just for the manual check button
      updateUpdateStatus('up-to-date', 'Đã kiểm tra - Không có cập nhật');
      showNotification('Đã kiểm tra cập nhật', 'info');
    } else {
      throw new Error('Auto-update not available');
    }
  } catch (error) {
    console.error('Error checking for updates:', error);
    updateUpdateStatus('error', 'Lỗi khi kiểm tra');
    showNotification('Lỗi khi kiểm tra cập nhật', 'error');
  } finally {
    if (elements.manualCheckUpdate) {
      elements.manualCheckUpdate.disabled = false;
      elements.manualCheckUpdate.innerHTML = '<i class="fas fa-search"></i> Kiểm tra ngay';
    }
  }
}

function showUpdateDetails(updateInfo) {
  if (elements.updateInfo && elements.updateDetails) {
    elements.updateInfo.style.display = 'block';
    
    elements.updateDetails.innerHTML = `
      <h4>Phiên bản mới có sẵn</h4>
      <div class="version-info">
        <div class="version-item">
          <strong>Phiên bản hiện tại:</strong>
          <span>1.0.0</span>
        </div>
        <div class="version-item">
          <strong>Phiên bản mới:</strong>
          <span>${updateInfo.version || 'N/A'}</span>
        </div>
      </div>
      <p><strong>Kích thước:</strong> ${updateInfo.files ? updateInfo.files[0]?.size ? formatFileSize(updateInfo.files[0].size) : 'N/A' : 'N/A'}</p>
      <p><strong>Ngày phát hành:</strong> ${updateInfo.releaseDate ? new Date(updateInfo.releaseDate).toLocaleDateString('vi-VN') : 'N/A'}</p>
    `;
  }
  
  if (elements.updateActions) {
    elements.updateActions.style.display = 'block';
  }
  
  if (elements.downloadUpdateBtn) {
    elements.downloadUpdateBtn.style.display = 'inline-flex';
  }
}

function hideUpdateDetails() {
  if (elements.updateInfo) {
    elements.updateInfo.style.display = 'none';
  }
  if (elements.updateActions) {
    elements.updateActions.style.display = 'none';
  }
  if (elements.downloadUpdateBtn) {
    elements.downloadUpdateBtn.style.display = 'none';
  }
  if (elements.installUpdateBtn) {
    elements.installUpdateBtn.style.display = 'none';
  }
}

// Enhanced auto-update functions
function setupAutoUpdate() {
  // Listen for update events
  if (window.electronAPI) {
    window.electronAPI.onUpdateAvailable((info) => {
      console.log('📦 [RENDERER] Update available:', info);
      updateInfo = info;
      showUpdateNotification();
      
      // Update settings tab if it's active
      if (document.querySelector('.tab-content.active')?.id === 'settings') {
        updateUpdateStatus('available', 'Có cập nhật mới');
        showUpdateDetails(info);
      }
    });
    
    window.electronAPI.onDownloadProgress((progress) => {
      console.log('📥 [RENDERER] Download progress:', progress.percent);
      updateDownloadProgress(progress.percent);
      
      // Update settings tab if it's active
      if (document.querySelector('.tab-content.active')?.id === 'settings') {
        updateUpdateStatus('checking', `Đang tải xuống... ${Math.round(progress.percent)}%`);
      }
    });
    
    window.electronAPI.onUpdateDownloaded((info) => {
      console.log('🎉 [RENDERER] Update downloaded:', info);
      showInstallNotification();
      
      // Update settings tab if it's active
      if (document.querySelector('.tab-content.active')?.id === 'settings') {
        updateUpdateStatus('available', 'Sẵn sàng cài đặt');
        if (elements.installUpdateBtn) {
          elements.installUpdateBtn.style.display = 'inline-flex';
        }
        if (elements.downloadUpdateBtn) {
          elements.downloadUpdateBtn.style.display = 'none';
        }
      }
    });
    
    // Handle update cancelled
    window.electronAPI.onUpdateCancelled((info) => {
      console.log('❌ [RENDERER] Update cancelled by user:', info);
      showNotification('Cập nhật đã bị hủy', 'info');
      
      // Update settings tab if it's active
      if (document.querySelector('.tab-content.active')?.id === 'settings') {
        updateUpdateStatus('cancelled', 'Đã hủy cập nhật');
        hideUpdateDetails();
      }
    });
  }
}

// Scroll to Top Functions
function scrollToTop() {
  console.log('Scroll to top clicked');
  try {
    // Get the main content container
    const mainContent = document.querySelector('.main-content');
    if (mainContent) {
      mainContent.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    } else {
      // Fallback to window scroll
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  } catch (error) {
    console.error('Error scrolling to top:', error);
    // Fallback method
    const mainContent = document.querySelector('.main-content');
    if (mainContent) {
      mainContent.scrollTop = 0;
    } else {
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }
  }
}

function handleScroll() {
  if (elements.scrollToTopBtn) {
    // Check scroll position of main content container
    const mainContent = document.querySelector('.main-content');
    let scrollTop = 0;
    
    if (mainContent) {
      scrollTop = mainContent.scrollTop;
    } else {
      scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    }
    
    console.log('Scroll position:', scrollTop);
    
    if (scrollTop > 300) {
      elements.scrollToTopBtn.classList.add('show');
    } else {
      elements.scrollToTopBtn.classList.remove('show');
    }
  }
}

// Expose functions to global scope
window.checkForUpdates = checkForUpdates;
window.downloadUpdate = downloadUpdate;
window.installUpdate = installUpdate;
window.manualCheckForUpdates = manualCheckForUpdates;

