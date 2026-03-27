# Cloudinary Video Integration

This backend uses Cloudinary for project videos and thumbnails.

## Environment Variables

Set these on Render (and locally):

- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`
- `CLOUDINARY_UPLOAD_FOLDER` (optional)
- `CLOUDINARY_ALLOWED_ROOT` (optional, default: `portfolio`)
- `CLOUDINARY_VERIFY_ASSET_EXISTENCE` (optional, default: `true`)
- `CLOUDINARY_FALLBACK_THUMBNAIL` (optional)

## Data Model

Projects store references only:

- `cloudinary_video_public_id`
- `cloudinary_thumbnail_public_id`
- generated delivery URLs in `video_url` and `thumbnail_url`

No binary/video file content is stored in PostgreSQL.

## Manual Upload Workflow

1. Upload your video manually in Cloudinary Media Library.
2. Copy the asset `public_id`.
3. Create/update a project using either:
   - `videoPublicId` (recommended), or
   - `videoUrl` (Cloudinary URL; backend extracts `public_id`)
4. Optionally provide `thumbnailPublicId` or `thumbnailUrl`.
5. If no thumbnail is provided, backend generates one from the video.

## Security Guardrails

- `public_id` ownership is enforced by folder namespace.
- Every `public_id` must start with: `portfolio/` (or your `CLOUDINARY_ALLOWED_ROOT`).
- On update, project-level scoping is enforced:
  - required prefix: `portfolio/{projectId}/...`

This prevents cross-tenant or arbitrary asset linking.

## Delivery Transformations

- Video URLs are generated with optimization:
  - `resource_type: video`
  - `quality: auto`
  - `fetch_format: auto`
- Thumbnail URLs are generated from video with:
  - `resource_type: video`
  - `format: jpg`
  - `transformation: [{ width: 400, crop: "scale" }]`

## Existence Validation

Before saving media references, backend validates assets exist using Cloudinary Admin API:

- video: `cloudinary.api.resource(publicId, { resource_type: "video" })`
- thumbnail (if provided): `cloudinary.api.resource(publicId, { resource_type: "image" })`

If asset is missing, save is rejected.

## Fallback Behavior

If media URL generation fails, API response falls back to:

- `videoUrl: null`
- `thumbnailUrl: /fallback-thumbnail.png` (configurable)

## API Payload Example

```json
{
  "title": "My Project",
  "company": "My Company",
  "description": "Demo project",
  "videoPublicId": "portfolio/projects/my-video",
  "thumbnailPublicId": "portfolio/projects/my-thumb",
  "projectUrl": "https://example.com",
  "category": "Featured",
  "technologies": ["React", "Node.js"]
}
```

## Notes

- Local `/uploads` static storage is removed.
- Compatible with Render's ephemeral filesystem.
- Deleting a project attempts Cloudinary asset cleanup when IDs are available.
