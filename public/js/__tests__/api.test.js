import API from '../api.js';

describe('API', () => {
    const mockPost = {
        id: 1,
        title: 'Test Post',
        body: 'Test Body',
        userId: 1
    };

    const mockComment = {
        id: 1,
        postId: 1,
        name: 'Test Name',
        email: 'test@example.com',
        body: 'Test Comment'
    };

    beforeEach(() => {
        fetch.mockClear();
    });

    describe('validateResponse', () => {
        test('should throw error for non-ok response', () => {
            const response = { ok: false, status: 404 };
            expect(() => API.validateResponse(response)).toThrow('HTTP error! status: 404');
        });

        test('should return response for ok response', () => {
            const response = { ok: true };
            expect(API.validateResponse(response)).toEqual(response);
        });
    });

    describe('getPosts', () => {
        test('should fetch and format posts correctly', async () => {
            const mockResponse = { ok: true, json: () => Promise.resolve([mockPost]) };
            fetch.mockResolvedValueOnce(mockResponse);

            const posts = await API.getPosts();
            expect(posts).toHaveLength(1);
            expect(posts[0]).toEqual(mockPost);
            expect(fetch).toHaveBeenCalledWith('http://jsonplaceholder.typicode.com/posts');
        });

        test('should handle invalid data format', async () => {
            const mockResponse = { ok: true, json: () => Promise.resolve('invalid') };
            fetch.mockResolvedValueOnce(mockResponse);

            await expect(API.getPosts()).rejects.toThrow('Invalid data format');
        });

        test('should handle network error', async () => {
            fetch.mockRejectedValueOnce(new Error('Network error'));
            await expect(API.getPosts()).rejects.toThrow('Network error');
        });
    });

    describe('getComments', () => {
        test('should fetch and format comments correctly', async () => {
            const mockResponse = { ok: true, json: () => Promise.resolve([mockComment]) };
            fetch.mockResolvedValueOnce(mockResponse);

            const comments = await API.getComments(1);
            expect(comments).toHaveLength(1);
            expect(comments[0]).toEqual(mockComment);
            expect(fetch).toHaveBeenCalledWith('http://jsonplaceholder.typicode.com/posts/1/comments');
        });

        test('should reject invalid post ID', async () => {
            await expect(API.getComments('invalid')).rejects.toThrow('Invalid post ID');
            await expect(API.getComments(0)).rejects.toThrow('Invalid post ID');
            await expect(API.getComments(-1)).rejects.toThrow('Invalid post ID');
        });

        test('should handle invalid data format', async () => {
            const mockResponse = { ok: true, json: () => Promise.resolve('invalid') };
            fetch.mockResolvedValueOnce(mockResponse);

            await expect(API.getComments(1)).rejects.toThrow('Invalid data format');
        });

        test('should handle network error', async () => {
            fetch.mockRejectedValueOnce(new Error('Network error'));
            await expect(API.getComments(1)).rejects.toThrow('Network error');
        });
    });
});