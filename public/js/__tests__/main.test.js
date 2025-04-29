import App from '../main.js';
import API from '../api.js';
import Utils from '../utils.js';

jest.mock('../api.js');
jest.mock('../utils.js');

describe('App', () => {
    let app;
    
    beforeEach(() => {
        // Set up document body
        document.body.innerHTML = `
            <div id="postsPage"></div>
            <div id="reportsPage"></div>
            <div id="postsLink"></div>
            <div id="reportsLink"></div>
            <div id="postsTableBody"></div>
            <div id="searchInput"></div>
            <div id="rerumCount"></div>
            <div id="userPostsTableBody"></div>
            <div id="commentsModal"></div>
            <div id="commentsContent"></div>
            <div id="closeModal"></div>
        `;

        // Mock API methods
        API.getPosts = jest.fn().mockResolvedValue([
            { id: 1, title: 'Test Post', body: 'Test Body', userId: 1 }
        ]);
        API.getComments = jest.fn().mockResolvedValue([
            { id: 1, postId: 1, name: 'Test Name', email: 'test@example.com', body: 'Test Comment' }
        ]);

        // Mock Utils methods
        Utils.sanitizeHTML = jest.fn(str => str);
        Utils.highlightRerum = jest.fn(str => str);
        Utils.countPostsWithRerum = jest.fn().mockReturnValue(2);
        Utils.getUserPostCounts = jest.fn().mockReturnValue({ '1': 3 });
        Utils.filterPosts = jest.fn(posts => posts);
        Utils.formatComments = jest.fn().mockReturnValue('<div>Test Comment</div>');

        app = new App();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('initialization', () => {
        test('should initialize with default state', () => {
            expect(app.posts).toEqual([]);
            expect(app.currentPage).toBe('posts');
            expect(API.getPosts).toHaveBeenCalled();
        });
    });

    describe('showPage', () => {
        test('should switch to posts page', () => {
            app.showPage('posts');
            expect(app.postsPage.classList.contains('hidden')).toBe(false);
            expect(app.reportsPage.classList.contains('hidden')).toBe(true);
            expect(app.currentPage).toBe('posts');
        });

        test('should switch to reports page', () => {
            app.showPage('reports');
            expect(app.postsPage.classList.contains('hidden')).toBe(true);
            expect(app.reportsPage.classList.contains('hidden')).toBe(false);
            expect(app.currentPage).toBe('reports');
        });
    });

    describe('handleSearch', () => {
        test('should filter and render posts', () => {
            const searchTerm = 'test';
            app.searchInput.value = searchTerm;
            app.handleSearch();
            expect(Utils.filterPosts).toHaveBeenCalledWith(app.posts, searchTerm);
        });
    });

    describe('showComments', () => {
        test('should fetch and display comments', async () => {
            await app.showComments(1);
            expect(API.getComments).toHaveBeenCalledWith(1);
            expect(Utils.formatComments).toHaveBeenCalled();
            expect(app.commentsModal.classList.contains('hidden')).toBe(false);
        });

        test('should handle error when fetching comments', async () => {
            const consoleError = jest.spyOn(console, 'error').mockImplementation();
            API.getComments.mockRejectedValueOnce(new Error('Failed to fetch'));
            
            await app.showComments(1);
            expect(consoleError).toHaveBeenCalled();
            consoleError.mockRestore();
        });
    });

    describe('hideCommentsModal', () => {
        test('should hide comments modal', () => {
            app.hideCommentsModal();
            expect(app.commentsModal.classList.contains('hidden')).toBe(true);
        });
    });

    describe('loadData', () => {
        test('should load and render posts', async () => {
            await app.loadData();
            expect(API.getPosts).toHaveBeenCalled();
            expect(app.posts).toHaveLength(1);
        });

        test('should handle error when loading posts', async () => {
            const consoleError = jest.spyOn(console, 'error').mockImplementation();
            API.getPosts.mockRejectedValueOnce(new Error('Failed to fetch'));
            
            await app.loadData();
            expect(consoleError).toHaveBeenCalled();
            consoleError.mockRestore();
        });
    });
});