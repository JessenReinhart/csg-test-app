import API from '../api.js';

describe('API', () => {
    beforeEach(() => {
        global.fetch = jest.fn();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('getPosts', () => {
        test('successfully fetches posts', async () => {
            const mockPosts = [{ id: 1, title: 'Test', body: 'Content', userId: 1 }];
            fetch.mockResolvedValue({
                ok: true,
                json: () => Promise.resolve(mockPosts)
            });

            const posts = await API.getPosts();
            expect(fetch).toHaveBeenCalledWith('http://jsonplaceholder.typicode.com/posts');
            expect(posts).toEqual(mockPosts);
        });

        test('handles API errors', async () => {
            fetch.mockResolvedValue({ ok: false, status: 500 });
            await expect(API.getPosts()).rejects.toThrow('HTTP error! status: 500');
        });
    });

    describe('getComments', () => {
        test('successfully fetches comments with valid post ID', async () => {
            const mockComments = [{ id: 1, postId: 1, name: 'Test', email: 'test@test.com', body: 'Comment' }];
            fetch.mockResolvedValue({
                ok: true,
                json: () => Promise.resolve(mockComments)
            });

            const comments = await API.getComments(1);
            expect(fetch).toHaveBeenCalledWith('http://jsonplaceholder.typicode.com/posts/1/comments');
            expect(comments).toEqual(mockComments);
        });

        test('rejects invalid post IDs', async () => {
            await expect(API.getComments('invalid')).rejects.toThrow('Invalid post ID');
            await expect(API.getComments(-1)).rejects.toThrow('Invalid post ID');
        });

        test('handles API errors', async () => {
            fetch.mockResolvedValue({ ok: false, status: 404 });
            await expect(API.getComments(1)).rejects.toThrow('HTTP error! status: 404');
        });
    });
});