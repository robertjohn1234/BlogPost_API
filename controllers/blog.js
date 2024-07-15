const BlogPost = require('../models/BlogPost');
const Comment = require('../models/Comment');

module.exports.addBlog = (req, res) => {

    const authorId = req.user.id;
    const authorEmail = req.user.email;

    return BlogPost.findOne({ title: req.body.title }).then(existingBlog => {
        if (existingBlog) {
            return res.status(409).send({ error: 'Blog already exists' });
        }

        let newBlog = new BlogPost({
            title: req.body.title,
            content: req.body.content,
            authorId: authorId,
            authorEmail: authorEmail
        });

        return newBlog.save().then(savedBlog => {
            res.status(201).send({ savedBlog });
        }).catch(saveError => {
            console.error('Error in saving the blog: ', saveError);
            res.status(500).send({ error: 'Failed to save the blog' });
        });

    }).catch(findErr => {
        console.error('Error in finding the blog: ', findErr);
        return res.status(500).send({ message: "Error in finding the blog" });
    });
};

module.exports.getAllBlogs = (req, res) => {
	
	return BlogPost.find({}).then(blogs => {
		
		if(blogs.length > 0) {		
			return res.status(200).send({ blogs });			
		} else {		
			return res.status(200).send({ message : 'No blogs found.' })
		}
		
	}).catch(findErr => {		
		console.error('Error in finding all blogs: ', findErr);		
		return res.status(500).send({ error : 'Error finding blogs.'})
	});
};

module.exports.getBlogById = (req, res) => {
	
	return BlogPost.findById(req.params.id).then(blog => {		

		if(!blog) {			
			return res.status(404).send({ error: 'Blog not found '});			
		}		
		return res.status(200).send({ blog });		
	}).catch(findErr => {	

		console.error('Error finding blogs: ', findErr);		
		return res.status(500).send({ error : 'Failed to fetch blog'});
	});
};

module.exports.updateBlog = (req, res) => {
    let blogId = req.params.id;
    let userId = req.user.id;

    BlogPost.findById(blogId).then(blog => {


        if (blog.author.toString() !== userId.toString()) {
            return res.status(403).send({ error: 'You are not authorized to update this blog' });
        }

        let updatedFields = {
            title: req.body.title,
            content: req.body.content,
            isActive: req.body.isActive 
        };

        return BlogPost.findByIdAndUpdate(blogId, updatedFields, { new: true }).then(updatedBlog => {
            if (updatedBlog) {
                return res.status(200).send({
                    message: 'Blog updated successfully',
                    updatedBlog: updatedBlog
                });
            } else {
                return res.status(404).send({ error: 'Blog not found' });
            }
        }).catch(updateErr => {
            console.error('Error in updating the blog: ', updateErr);
            return res.status(500).send({ error: 'Error in updating the blog' });
        });

    }).catch(findErr => {
        console.error('Error in finding the blog: ', findErr);
        return res.status(500).send({ error: 'Error in finding the blog' });
    });
};

module.exports.deleteBlog = (req, res) => {
    let blogId = req.params.id;
    let userId = req.user.id;
    let userIsAdmin = req.user.isAdmin;

    // Find the blog post to verify the author or admin
    BlogPost.findById(blogId).then(blog => {
        if (!blog) {
            console.error('Blog not found');
            return res.status(404).send({ error: 'Blog not found' });
        }

        // Verify if the authenticated user is the author of the blog or an admin
        if (blog.author.toString() !== userId.toString() && !userIsAdmin) {
            console.error('User not authorized to delete this blog');
            return res.status(403).send({ error: 'You are not authorized to delete this blog' });
        }

        // Delete the blog
        BlogPost.deleteOne({ _id: blogId }).then(deletedResult => {
            if (deletedResult.deletedCount < 1) {
                return res.status(400).send({ error: 'No blog deleted' });
            }

            return res.status(200).send({ 
                message: 'Blog deleted successfully'
            });
        }).catch(err => {
            console.error("Error in deleting the blog: ", err);
            return res.status(500).send({ error: 'Error in deleting the blog.' });
        });
    }).catch(err => {
        console.error('Error in finding the blog: ', err);
        return res.status(500).send({ error: 'Error in finding the blog.' });
    });
};

module.exports.addBlogComment = (req, res) => {
    let blogId = req.params.id;
    let userId = req.user.id;
    let userEmail = req.user.email;

    let newComment = new Comment({
        content: req.body.content,
        authorId: userId,
        authorEmail: userEmail,
        post: blogId
    });

    newComment.save().then(savedComment => {

        return BlogPost.findByIdAndUpdate(
            blogId,
            { $push: { comments: savedComment._id } },
            { new: true }
        ).then(updatedBlog => {
            if (!updatedBlog) {
                return res.status(404).send({ error: 'Blog not found' });
            }
            return res.status(201).send({
                message: 'Comment added successfully',
                comment: savedComment,
                blog: updatedBlog
            });
        }).catch(err => {
            console.error('Error in updating the blog with new comment: ', err);
            return res.status(500).send({ error: 'Error in updating the blog with new comment' });
        });
    }).catch(err => {
        console.error('Error in saving the comment: ', err);
        return res.status(500).send({ error: 'Error in saving the comment' });
    });
};

module.exports.deleteCommentById = (req, res) => {
    let blogId = req.params.id;
    let commentId = req.params.commentId;
    let userId = req.user.id;
    let userIsAdmin = req.user.isAdmin;

    // console.log(`Blog ID: ${blogId}`);
    // console.log(`Comment ID: ${commentId}`);
    // console.log(`User ID: ${userId}`);

    // Find the comment to verify the author
    Comment.findById(commentId).then(comment => {
        if (!comment) {
            console.error('Comment not found');
            return res.status(404).send({ error: 'Comment not found' });
        }

        // Verify if the authenticated user is the author of the comment
        if (comment.author.toString() !== userId.toString() && !userIsAdmin) {
            console.error('User not authorized to delete this comment');
            return res.status(403).send({ error: 'You are not authorized to delete this comment' });
        }

        // Delete the comment using findByIdAndDelete
        Comment.findByIdAndDelete(commentId).then(() => {
            // Remove the comment from the blog post's comments array
            return BlogPost.findByIdAndUpdate(
                blogId,
                { $pull: { comments: commentId } },
                { new: true }
            ).then(updatedBlog => {
                if (!updatedBlog) {
                    console.error('Blog not found after removing comment');
                    return res.status(404).send({ error: 'Blog not found' });
                }
                return res.status(200).send({
                    message: 'Comment deleted successfully',
                    blog: updatedBlog
                });
            }).catch(err => {
                console.error('Error in updating the blog after deleting the comment: ', err);
                return res.status(500).send({ error: 'Error in updating the blog after deleting the comment' });
            });
        }).catch(err => {
            console.error('Error in deleting the comment: ', err);
            return res.status(500).send({ error: 'Error in deleting the comment' });
        });
    }).catch(err => {
        console.error('Error in finding the comment: ', err);
        return res.status(500).send({ error: 'Error in finding the comment' });
    });
};

module.exports.getAllComments = (req, res) => {
    let blogId = req.params.id;

    BlogPost.findById(blogId).populate('comments').then(blog => {
        if (!blog) {
            return res.status(404).send({ error: 'Blog not found' });
        }

        return res.status(200).send({ comments: blog.comments });
    }).catch(err => {
        console.error('Error in retrieving comments: ', err);
        return res.status(500).send({ error: 'Failed to retrieve comments' });
    });
};

module.exports.getCommentById = (req, res) => {
    let blogId = req.params.id;
    let commentId = req.params.commentId;

    BlogPost.findById(blogId).populate({
        path: 'comments',
        match: { _id: commentId }
    }).then(blog => {
        if (!blog) {
            return res.status(404).send({ error: 'Blog not found' });
        }

        let comment = blog.comments.find(comment => comment._id.toString() === commentId);
        if (!comment) {
            return res.status(404).send({ error: 'Comment not found' });
        }

        return res.status(200).send({ comment });
    }).catch(err => {
        console.error('Error in retrieving comment: ', err);
        return res.status(500).send({ error: 'Failed to retrieve comment' });
    });
};