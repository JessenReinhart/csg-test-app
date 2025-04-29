class Utils {
    static countPostsWithRerum(posts) {
        return posts.filter(post => post.body.toLowerCase().includes('rerum')).length;
    }

    static getUserPostCounts(posts) {
        return posts.reduce((acc, post) => {
            acc[post.userId] = (acc[post.userId] || 0) + 1;
            return acc;
        }, {});
    }

    static sanitizeHTML(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    static highlightRerum(text) {
        const sanitized = this.sanitizeHTML(text);
        return sanitized.replace(/rerum/gi, match => `<span class="highlight-rerum">${match}</span>`);
    }

    static filterPosts(posts, searchTerm) {
        if (!searchTerm) return posts;
        searchTerm = searchTerm.toLowerCase();
        return posts.filter(post => 
            post.title.toLowerCase().includes(searchTerm) ||
            post.body.toLowerCase().includes(searchTerm)
        );
    }

    static formatComments(comments) {
        return comments.map(comment => `
            <div class="border-b last:border-0 py-3">
                <h4 class="font-semibold">${this.sanitizeHTML(comment.name)}</h4>
                <p class="text-gray-600 text-sm">${this.sanitizeHTML(comment.email)}</p>
                <p class="mt-2">${this.sanitizeHTML(comment.body)}</p>
            </div>
        `).join('');
    }
}

export default Utils;