import { NextResponse, NextRequest } from 'next/server';
import { MongoClient, ObjectId } from 'mongodb';

const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/PTS_PRO";
const client = new MongoClient(uri);

let clientPromise: Promise<MongoClient> | null = null;

async function connectToDatabase() {
    if (!clientPromise) {
        clientPromise = client.connect();
    }
    const connectedClient = await clientPromise;
    return connectedClient.db("PTS_PRO");
}

export async function GET() {
    try {
        const db = await connectToDatabase();
        const collection = db.collection('comments');
        // Fetch all comments, we will handle threading on the frontend
        const comments = await collection.find({}).sort({ createdAt: -1 }).toArray();
        return NextResponse.json(comments);
    } catch (error) {
        console.error('Error fetching comments:', error);
        return NextResponse.json({ error: 'Failed to fetch comments' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { uid, displayName, photoURL, content, parentId, email } = body;

        if (!uid || !displayName || !content) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const db = await connectToDatabase();
        const collection = db.collection('comments');

        const newComment = {
            uid,
            displayName,
            email: email || '',
            photoURL: photoURL || '',
            content,
            parentId: parentId || null,
            likes: 0,
            dislikes: 0,
            likedBy: [],
            dislikedBy: [],
            createdAt: new Date()
        };

        const result = await collection.insertOne(newComment);
        return NextResponse.json({ message: 'Comment posted successfully', id: result.insertedId, comment: newComment }, { status: 201 });
    } catch (error) {
        console.error('Error posting comment:', error);
        return NextResponse.json({ error: 'Failed to post comment' }, { status: 500 });
    }
}

export async function PATCH(request: NextRequest) {
    try {
        const body = await request.json();
        const { commentId, uid, action } = body; // action can be 'like' or 'dislike'

        if (!commentId || !uid || !action) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const db = await connectToDatabase();
        const collection = db.collection('comments');

        const comment = await collection.findOne({ _id: new ObjectId(commentId) });

        if (!comment) {
            return NextResponse.json({ error: 'Comment not found' }, { status: 404 });
        }

        let updateQuery = {};

        if (action === 'like') {
            if (comment.likedBy?.includes(uid)) {
                // User already liked, remove like
                updateQuery = {
                    $inc: { likes: -1 },
                    $pull: { likedBy: uid }
                };
            } else {
                // Remove dislike if exists, add like
                updateQuery = {
                    $inc: { likes: 1, dislikes: comment.dislikedBy?.includes(uid) ? -1 : 0 },
                    $push: { likedBy: uid },
                    $pull: { dislikedBy: uid }
                };
            }
        } else if (action === 'dislike') {
            if (comment.dislikedBy?.includes(uid)) {
                // User already disliked, remove dislike
                updateQuery = {
                    $inc: { dislikes: -1 },
                    $pull: { dislikedBy: uid }
                };
            } else {
                // Remove like if exists, add dislike
                updateQuery = {
                    $inc: { dislikes: 1, likes: comment.likedBy?.includes(uid) ? -1 : 0 },
                    $push: { dislikedBy: uid },
                    $pull: { likedBy: uid }
                };
            }
        }

        const result = await collection.updateOne(
            { _id: new ObjectId(commentId) },
            updateQuery as Record<string, unknown>
        );

        if (result.modifiedCount === 1) {
            const updatedComment = await collection.findOne({ _id: new ObjectId(commentId) });
            return NextResponse.json({ message: 'Comment updated successfully', comment: updatedComment }, { status: 200 });
        } else {
            return NextResponse.json({ error: 'Failed to update comment' }, { status: 500 });
        }

    } catch (error) {
        console.error('Error updating comment:', error);
        return NextResponse.json({ error: 'Failed to update comment' }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const body = await request.json();
        const { commentId, uid, email } = body;

        if (!commentId || !uid) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const db = await connectToDatabase();
        const collection = db.collection('comments');

        // Optional: you could fetch first to ensure the uid matches the comment.uid
        // But for a simple implementation, we assume if uid matches, they can delete.
        const comment = await collection.findOne({ _id: new ObjectId(commentId) });

        if (!comment) {
            return NextResponse.json({ error: 'Comment not found' }, { status: 404 });
        }

        const ADMIN_EMAIL = "alphaprime.co.in@gmail.com";
        const isAdmin = email === ADMIN_EMAIL;

        if (comment.uid !== uid && !isAdmin) {
            return NextResponse.json({ error: 'Unauthorized to delete this comment' }, { status: 403 });
        }

        const result = await collection.deleteOne({ _id: new ObjectId(commentId) });

        if (result.deletedCount === 1) {
            return NextResponse.json({ message: 'Comment deleted successfully' }, { status: 200 });
        } else {
            return NextResponse.json({ error: 'Failed to delete comment' }, { status: 500 });
        }
    } catch (error) {
        console.error('Error deleting comment:', error);
        return NextResponse.json({ error: 'Failed to delete comment' }, { status: 500 });
    }
}
