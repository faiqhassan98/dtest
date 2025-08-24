import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
const UserSchema = new Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'user'], default: 'user' },
    enabled: { type: Boolean, default: true },
    loginExpiry: { type: Date, required: true },
    loginCount: { type: Number, default: 0 }
}, { timestamps: true });
UserSchema.pre('save', async function (next) {
    if (!this.isModified('password'))
        return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});
UserSchema.methods.comparePassword = function (candidate) {
    return bcrypt.compare(candidate, this.password);
};
export const User = mongoose.model('User', UserSchema);
