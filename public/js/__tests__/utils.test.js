import Utils from '../utils.js';

describe('Utils', () => {
    beforeAll(() => {
        // Set up document for testing
        document.body.innerHTML = '<div id="test"></div>';
    });

    describe('countPostsWithRerum', () => {
        test('should count posts containing rerum correctly', () => {
            const posts = [
                { body: 'rerum test post' },
                { body: 'normal post' },
                { body: 'RERUM uppercase' },
                { body: 'another rerum post' }
            ];
            expect(Utils.countPostsWithRerum(posts)).toBe(3);
        });

        test('should return 0 when no posts contain rerum', () => {
            const posts = [
                { body: 'test post' },
                { body: 'normal post' }
            ];
            expect(Utils.countPostsWithRerum(posts)).toBe(0);
        });
    });

    describe('getUserPostCounts', () => {
        test('should count posts per user correctly', () => {
            const posts = [
                { userId: 1 },
                { userId: 1 },
                { userId: 2 },
                { userId: 3 },
                { userId: 1 }
            ];
            const expected = { '1': 3, '2': 1, '3': 1 };
            expect(Utils.getUserPostCounts(posts)).toEqual(expected);
        });

        test('should handle empty posts array', () => {
            expect(Utils.getUserPostCounts([])).toEqual({});
        });
    });

    describe('sanitizeHTML', () => {
        test('should escape HTML special characters', () => {
            const input = '<script>alert("test")</script>';
            const output = Utils.sanitizeHTML(input);
            expect(output).not.toContain('<script>');
            expect(output).toEqual('&lt;script&gt;alert("test")&lt;/script&gt;');
        });
    });

    describe('highlightRerum', () => {
        test('should wrap rerum in highlight span', () => {
            const input = 'This is a rerum test';
            const output = Utils.highlightRerum(input);
            expect(output).toContain('<span class="highlight-rerum">rerum</span>');
        });

        test('should handle multiple rerum occurrences', () => {
            const input = 'rerum here and rerum there';
            const output = Utils.highlightRerum(input);
            const matches = output.match(/highlight-rerum/g);
            expect(matches).toHaveLength(2);
        });
    });

    describe('filterPosts', () => {
        const testPosts = [
            { title: 'test title', body: 'test body' },
            { title: 'another title', body: 'search term here' },
            { title: 'search term', body: 'different body' }
        ];

        test('should filter posts by title', () => {
            const filtered = Utils.filterPosts(testPosts, 'test');
            expect(filtered).toHaveLength(1);
            expect(filtered[0].title).toBe('test title');
        });

        test('should filter posts by body', () => {
            const filtered = Utils.filterPosts(testPosts, 'search term');
            expect(filtered).toHaveLength(2);
        });

        test('should return all posts when search term is empty', () => {
            const filtered = Utils.filterPosts(testPosts, '');
            expect(filtered).toHaveLength(testPosts.length);
        });
    });

    describe('formatComments', () => {
        test('should format comments correctly', () => {
            const comments = [{
                name: 'Test Name',
                email: 'test@example.com',
                body: 'Test comment'
            }];
            const formatted = Utils.formatComments(comments);
            expect(formatted).toContain('Test Name');
            expect(formatted).toContain('test@example.com');
            expect(formatted).toContain('Test comment');
        });

        test('should sanitize HTML in comments', () => {
            const comments = [{
                name: '<script>alert("test")</script>',
                email: 'test@example.com',
                body: 'Test comment'
            }];
            const formatted = Utils.formatComments(comments);
            expect(formatted).not.toContain('<script>');
            expect(formatted).toContain('&lt;script&gt;');
        });
    });
});