const API_BASE_URL = 'http://jsonplaceholder.typicode.com';

class API {
    static validateResponse(response) {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response;
    }

    static async getPosts() {
        try {
            const response = await fetch(`${API_BASE_URL}/posts`);
            this.validateResponse(response);
            const data = await response.json();
            
            // Validate data structure
            if (!Array.isArray(data)) {
                throw new Error('Invalid data format: Expected an array of posts');
            }
            
            return data.map(post => ({
                id: parseInt(post.id, 10),
                title: String(post.title || ''),
                body: String(post.body || ''),
                userId: parseInt(post.userId, 10)
            }));
        } catch (error) {
            console.error('Error fetching posts:', error);
            throw error;
        }
    }

    static async getComments(postId) {
        try {
            // Validate postId
            if (!Number.isInteger(postId) || postId <= 0) {
                throw new Error('Invalid post ID');
            }

            const response = await fetch(`${API_BASE_URL}/posts/${postId}/comments`);
            this.validateResponse(response);
            const data = await response.json();

            // Validate data structure
            if (!Array.isArray(data)) {
                throw new Error('Invalid data format: Expected an array of comments');
            }

            return data.map(comment => ({
                id: parseInt(comment.id, 10),
                postId: parseInt(comment.postId, 10),
                name: String(comment.name || ''),
                email: String(comment.email || ''),
                body: String(comment.body || '')
            }));
        } catch (error) {
            console.error('Error fetching comments:', error);
            throw error;
        }
    }
}

export default API;