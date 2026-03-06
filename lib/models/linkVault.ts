import mongoose, { Schema, Document } from 'mongoose';

export interface ILinkVault extends Document {
    shortId: string;
    normalizedUrl: string;
    originalUrl: string;
    actionType: 'message' | 'redirect' | 'image' | 'note';
    actionData: string;
    passwordHash: string;
    status: 'active' | 'paused';
    createdAt: Date;
}

const LinkVaultSchema = new Schema<ILinkVault>({
    shortId: { type: String, unique: true, index: true },
    normalizedUrl: { type: String, required: true, index: true },
    originalUrl: { type: String, required: true },
    actionType: {
        type: String,
        enum: ['message', 'redirect', 'image', 'note'],
        required: true
    },
    actionData: { type: String, required: true },
    passwordHash: { type: String, required: true },
    status: { type: String, enum: ['active', 'paused'], default: 'active' },
    createdAt: { type: Date, default: Date.now }
});

export const LinkVault = mongoose.models.LinkVault || mongoose.model<ILinkVault>('LinkVault', LinkVaultSchema, 'link_vault');
