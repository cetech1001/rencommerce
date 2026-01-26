# Image Storage Configuration

This application supports two image storage providers that can be toggled via environment variables.

## Storage Providers

### 1. File System (Default)
Stores uploaded images in the local `public/uploads` directory.

**Pros:**
- Simple setup, no additional configuration needed
- Fast local access
- No external dependencies

**Cons:**
- Not suitable for production deployments on platforms like Railway, Vercel, or Heroku (ephemeral filesystems)
- Images are lost when the container restarts

**Configuration:**
```env
STORAGE_PROVIDER=filesystem
```

### 2. Railway S3 Bucket
Stores uploaded images in a Railway S3-compatible bucket.

**Pros:**
- Persistent storage across deployments
- Suitable for production
- Scalable and reliable
- Full URLs stored in database

**Cons:**
- Requires Railway bucket setup
- Additional configuration needed

**Configuration:**
```env
STORAGE_PROVIDER=railway
S3_ENDPOINT=https://your-endpoint-url
S3_BUCKET=your-bucket-name
S3_REGION=us-east-1
S3_ACCESS_KEY_ID=your-access-key-id
S3_SECRET_ACCESS_KEY=your-secret-access-key
```

## Setup Instructions

### Using File System Storage (Development)

1. Set the storage provider in your `.env` file:
   ```env
   STORAGE_PROVIDER=filesystem
   ```

2. That's it! Images will be stored in `public/uploads/`

### Using Railway S3 Bucket Storage (Production)

#### Step 1: Create a Railway Bucket

1. Log in to your Railway dashboard
2. Navigate to your project
3. Click "+ New" → "Database" → Select "S3 Bucket" or "Object Storage"
4. Railway will create a bucket and provide the S3 credentials

#### Step 2: Connect Bucket to Your Service

Railway provides two ways to add the bucket variables to your service:

**Option A: Using Railway's "Connect Service to Bucket" Feature (Recommended)**

1. In your Railway project, go to your main service (e.g., "energyhub")
2. Click on the service settings
3. Look for the "Connect to Bucket" or "Service Variables" section
4. Railway will show you a modal to connect the bucket
5. Select "Bun" style (as shown in your screenshot)
6. Click "Add Variables"
7. Railway will automatically add all S3 variables to your service:
   - `S3_ENDPOINT`
   - `S3_BUCKET`
   - `S3_REGION`
   - `S3_ACCESS_KEY_ID`
   - `S3_SECRET_ACCESS_KEY`

**Option B: Manually Copy Variables**

1. Go to your bucket service in Railway
2. Click on the "Variables" tab
3. Copy each variable value
4. Go to your main service (energyhub)
5. Add each variable manually

#### Step 3: Update Your Local Environment

For local development with Railway bucket:

```env
STORAGE_PROVIDER=railway
S3_ENDPOINT=https://your-endpoint.railway.app
S3_BUCKET=your-bucket-name
S3_REGION=us-east-1
S3_ACCESS_KEY_ID=your-access-key-id
S3_SECRET_ACCESS_KEY=your-secret-access-key
```

#### Step 4: Update next.config.ts

Add your S3 endpoint hostname to allow images in Next.js:

```typescript
images: {
  remotePatterns: [
    {
      protocol: "https",
      hostname: "images.unsplash.com",
    },
    {
      protocol: "https",
      hostname: "your-endpoint.railway.app", // Extract hostname from S3_ENDPOINT
    },
  ],
},
```

## How It Works

The application uses a storage service abstraction with the AWS S3 SDK that automatically selects the correct provider based on the `STORAGE_PROVIDER` environment variable:

- **FileSystemStorage**: Stores images in `public/uploads/` and returns relative URLs like `/uploads/image.jpg`
- **RailwayBucketStorage**: Uses AWS S3 SDK to upload images to Railway's S3-compatible bucket and returns full URLs like `https://endpoint.com/bucket/image.jpg`

Both implementations support:
- ✅ Image upload with validation (type, size)
- ✅ Unique filename generation
- ✅ Image deletion

## Migration Between Providers

If you need to migrate from filesystem to Railway bucket (or vice versa):

1. **Filesystem → Railway**: You'll need to manually upload existing images from `public/uploads/` to your Railway bucket and update the database URLs.

2. **Railway → Filesystem**: Download images from Railway bucket to `public/uploads/` and update database URLs to relative paths.

> **Note**: The application stores the complete URL (whether relative or absolute) in the database, so changing providers requires updating existing image URLs in your database.

## Environment Variables Reference

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `STORAGE_PROVIDER` | No | `filesystem` | Storage provider to use (`filesystem` or `railway`) |
| `S3_ENDPOINT` | Yes (if using Railway) | - | S3 endpoint URL provided by Railway |
| `S3_BUCKET` | Yes (if using Railway) | - | Bucket name provided by Railway |
| `S3_REGION` | No | `us-east-1` | S3 region (usually us-east-1 for Railway) |
| `S3_ACCESS_KEY_ID` | Yes (if using Railway) | - | S3 access key ID provided by Railway |
| `S3_SECRET_ACCESS_KEY` | Yes (if using Railway) | - | S3 secret access key provided by Railway |

## Railway Deployment Checklist

When deploying to Railway with S3 bucket storage:

- [ ] Create S3 bucket service in Railway
- [ ] Connect bucket to your service (Railway auto-adds the 5 S3 variables)
- [ ] Set `STORAGE_PROVIDER=railway` in your service variables
- [ ] Update `next.config.ts` with S3 endpoint hostname
- [ ] Deploy and test image upload
- [ ] Verify images are accessible via the returned URLs

## Troubleshooting

### Images not uploading
- Check that `STORAGE_PROVIDER` is set correctly
- For Railway: Verify all 5 S3 variables are present in your service
- Check server logs for detailed error messages
- Ensure Railway bucket service is running

### Images not displaying
- For filesystem: Ensure `public/uploads/` directory exists and has write permissions
- For Railway: Add the S3 endpoint hostname to `next.config.ts` remote patterns
- Verify the URLs in the database match your storage provider format
- Check bucket permissions (should be publicly readable)

### "S3 configuration is missing" error
- Ensure you've connected the bucket to your service in Railway
- Verify all 5 environment variables are set: `S3_ENDPOINT`, `S3_BUCKET`, `S3_REGION`, `S3_ACCESS_KEY_ID`, `S3_SECRET_ACCESS_KEY`
- Check for typos in variable names

### Connection timeout or 403 errors
- Verify `S3_ACCESS_KEY_ID` and `S3_SECRET_ACCESS_KEY` are correct
- Ensure the bucket service is running in Railway
- Check Railway service logs for more details
