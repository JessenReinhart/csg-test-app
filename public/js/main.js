import API from './api.js';
import Utils from './utils.js';

class App {
    constructor() {
        this.posts = [];
        this.currentPage = 'posts';
        this.initializeElements();
        this.attachEventListeners();
        this.loadData();
    }

    initializeElements() {
        // Pages
        this.postsPage = document.getElementById('postsPage');
        this.reportsPage = document.getElementById('reportsPage');
        
        // Navigation
        this.postsLink = document.getElementById('postsLink');
        this.reportsLink = document.getElementById('reportsLink');
        
        // Posts table
        this.postsTableBody = document.getElementById('postsTableBody');
        this.searchInput = document.getElementById('searchInput');
        
        // Reports elements
        this.rerumCount = document.getElementById('rerumCount');
        this.userPostsTableBody = document.getElementById('userPostsTableBody');
        
        // Modal elements
        this.commentsModal = document.getElementById('commentsModal');
        this.commentsContent = document.getElementById('commentsContent');
        this.closeModal = document.getElementById('closeModal');
    }

    attachEventListeners() {
        this.postsLink.addEventListener('click', () => this.showPage('posts'));
        this.reportsLink.addEventListener('click', () => this.showPage('reports'));
        this.searchInput.addEventListener('input', () => this.handleSearch());
        this.closeModal.addEventListener('click', () => this.hideCommentsModal());
    }

    async loadData() {
        try {
            this.posts = await API.getPosts();
            this.renderPosts(this.posts);
            this.updateReports();
        } catch (error) {
            console.error('Failed to load data:', error);
        }
    }

    renderPosts(posts) {
        const template = document.createElement('template');
        template.innerHTML = posts.map(post => `
            <tr class="hover:bg-gray-50">
                <td class="px-6 py-4">${Utils.sanitizeHTML(post.title)}</td>
                <td class="px-6 py-4">${Utils.highlightRerum(post.body)}</td>
                <td class="px-6 py-4">${Utils.sanitizeHTML(String(post.userId))}</td>
                <td class="px-6 py-4">
                    <button 
                        data-post-id="${post.id}"
                        class="view-comments-btn text-blue-600 hover:text-blue-800 underline">
                        View Comments
                    </button>
                </td>
            </tr>
        `).join('');
        
        this.postsTableBody.innerHTML = '';
        this.postsTableBody.appendChild(template.content);

        // Add event listeners
        this.postsTableBody.querySelectorAll('.view-comments-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const postId = parseInt(e.target.dataset.postId, 10);
                if (!isNaN(postId)) {
                    this.showComments(postId);
                }
            });
        });
    }

    updateReports() {
        this.rerumCount.textContent = Utils.countPostsWithRerum(this.posts);

        const userPostCounts = Utils.getUserPostCounts(this.posts);
        const template = document.createElement('template');
        template.innerHTML = Object.entries(userPostCounts)
            .map(([userId, count]) => `
                <tr>
                    <td class="px-6 py-4">${Utils.sanitizeHTML(String(userId))}</td>
                    <td class="px-6 py-4">${Utils.sanitizeHTML(String(count))}</td>
                </tr>
            `).join('');
        
        this.userPostsTableBody.innerHTML = '';
        this.userPostsTableBody.appendChild(template.content);
    }

    showPage(page) {
        this.currentPage = page;
        if (page === 'posts') {
            this.postsPage.classList.remove('hidden');
            this.reportsPage.classList.add('hidden');
            this.postsLink.classList.add('border-blue-500');
            this.reportsLink.classList.remove('border-blue-500');
        } else {
            this.postsPage.classList.add('hidden');
            this.reportsPage.classList.remove('hidden');
            this.postsLink.classList.remove('border-blue-500');
            this.reportsLink.classList.add('border-blue-500');
        }
    }

    handleSearch() {
        const searchTerm = this.searchInput.value;
        const filteredPosts = Utils.filterPosts(this.posts, searchTerm);
        this.renderPosts(filteredPosts);
    }

    async showComments(postId) {
        try {
            const comments = await API.getComments(postId);
            this.commentsContent.innerHTML = Utils.formatComments(comments);
            this.commentsModal.classList.remove('hidden');
        } catch (error) {
            console.error('Failed to load comments:', error);
        }
    }

    hideCommentsModal() {
        this.commentsModal.classList.add('hidden');
    }
}

export default App;