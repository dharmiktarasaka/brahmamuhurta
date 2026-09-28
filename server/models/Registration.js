import mongoose from 'mongoose';

const registrationSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email address is required'],
      trim: true,
      lowercase: true
    },
    whatsapp: {
      type: String,
      required: [true, 'WhatsApp phone number is required'],
      trim: true
    },
    country: {
      type: String,
      default: 'India',
      trim: true
    },
    userRole: {
      type: String,
      default: '',
      trim: true
    },
    interestReason: {
      type: String,
      default: '',
      trim: true
    },
    consent: {
      type: Boolean,
      default: true
    },
    fee: {
      type: String,
      default: 'FREE',
      trim: true
    },
    stuckArea: {
      type: String,
      default: '',
      trim: true
    },
    liveCommit: {
      type: String,
      default: "Yes, I'll be there live",
      trim: true
    },
    goDeeper: {
      type: String,
      default: "Yes, if it's right for me",
      trim: true
    },
    status: {
      type: String,
      enum: ['Confirmed', 'Contacted', 'Attended', 'Cancelled'],
      default: 'Confirmed'
    },
    notes: {
      type: String,
      default: '',
      trim: true
    },
    registeredAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        return ret;
      }
    }
  }
);

// Index for fast search and filtering
registrationSchema.index({ email: 1 });
registrationSchema.index({ country: 1 });
registrationSchema.index({ status: 1 });
registrationSchema.index({ registeredAt: -1 });

const Registration = mongoose.models.Registration || mongoose.model('Registration', registrationSchema);

export default Registration;
