# Manual Testing Guide - Pages Feature

## Prerequisites
1. Both servers must be running:
   - Backend: `cd server && npm start` (port 3001)
   - Frontend: `pnpm run dev` (port 5173)
2. Default admin account exists: admin@example.com / admin123

## Test 1: Login and Access Pages List
**Test ID**: Feature #1, #4, #5 (Authentication + Protected Routes)

**Steps**:
1. Navigate to http://localhost:5173/admin/login
2. Enter email: admin@example.com
3. Enter password: admin123
4. Click "Sign In" button
5. Should redirect to /admin dashboard
6. Click "Pages" in sidebar navigation
7. Should see pages list (empty initially)

**Expected Results**:
- ✅ Login successful
- ✅ Dashboard displays
- ✅ Pages link visible in sidebar
- ✅ Pages list shows with "No pages found" message
- ✅ "Create Page" button visible

## Test 2: Create New Page with Basic Content
**Test ID**: Feature #11 - "Create new page with basic content"

**Steps**:
1. From pages list, click "New Page" button
2. Verify redirect to /admin/pages/new
3. Enter Title: "My First Page"
4. Verify Slug auto-generates to: "my-first-page"
5. In Content textarea, enter: "This is my first page content. Welcome!"
6. In Excerpt, enter: "A test page"
7. Leave Status as "draft"
8. Leave Template as "standard"
9. Click "Save" button
10. Wait for success message
11. Verify redirect to pages list
12. Verify new page appears in table

**Expected Results**:
- ✅ New page form loads correctly
- ✅ Title field is large and prominent
- ✅ Slug auto-generates from title
- ✅ All form fields editable
- ✅ Save button works
- ✅ Success message: "Page created successfully!"
- ✅ Redirects to /admin/pages
- ✅ New page visible in table with:
  - Title: "My First Page"
  - Status badge: "draft" (gray)
  - Author: "Admin User"
  - Modified date: Today's date
  - Action buttons: Edit, Preview, Delete

## Test 3: Edit Existing Page
**Test ID**: Not explicitly in feature list yet

**Steps**:
1. From pages list, find "My First Page"
2. Click Edit button (pencil icon)
3. Verify redirect to /admin/pages/1/edit
4. Verify all fields populated with existing data
5. Change Title to: "My Updated Page"
6. Change slug to: "my-updated-page"
7. Add more content: " This content has been updated."
8. Click "Save" button
9. Verify success message
10. Verify redirect to pages list
11. Verify changes reflected in table

**Expected Results**:
- ✅ Edit form loads with existing data
- ✅ All fields editable
- ✅ Save updates the page
- ✅ Success message: "Page updated successfully!"
- ✅ Changes visible in pages list

## Test 4: Search and Filter
**Test ID**: Not explicitly in feature list

**Steps**:
1. Create 2-3 more pages with different statuses
2. Use search box to search for page titles
3. Use status filter to show only "draft" pages
4. Clear search, change filter to "all"

**Expected Results**:
- ✅ Search filters results in real-time
- ✅ Status filter works correctly
- ✅ Table updates immediately

## Test 5: Delete Page
**Test ID**: Related to pages management

**Steps**:
1. From pages list, click Delete button (trash icon) on a page
2. Verify confirmation dialog appears
3. Click "OK" to confirm
4. Verify page removed from list

**Expected Results**:
- ✅ Confirmation dialog: "Are you sure you want to delete this page?"
- ✅ Page deleted from database
- ✅ Page removed from table immediately
- ✅ No errors in console

## Test 6: Publish/Unpublish Status
**Test ID**: Part of draft/publish workflow

**Steps**:
1. Create or edit a page
2. Set Status to "published"
3. Save the page
4. Verify status badge changes to green "published"
5. Edit the page again
6. Change Status back to "draft"
7. Save and verify badge changes to gray "draft"

**Expected Results**:
- ✅ Status changes save correctly
- ✅ Badge colors:
  - Draft: Gray
  - Published: Green
  - Scheduled: Blue
- ✅ Status persists after page reload

## API Testing (Optional)

### Get Auth Token
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"admin123"}'
```

### List All Pages
```bash
curl -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  http://localhost:3001/api/pages
```

### Create Page via API
```bash
curl -X POST http://localhost:3001/api/pages \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "API Created Page",
    "content": "<p>This page was created via API</p>",
    "status": "draft"
  }'
```

### Update Page via API
```bash
curl -X PUT http://localhost:3001/api/pages/1 \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated Title",
    "content": "<p>Updated content</p>"
  }'
```

### Delete Page via API
```bash
curl -X DELETE http://localhost:3001/api/pages/1 \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Known Issues / Limitations
1. **Rich Text Editor**: Currently using plain textarea. TipTap integration coming next.
2. **Preview Button**: Placeholder - preview functionality not yet implemented.
3. **Featured Images**: Image upload not yet implemented.
4. **Page Modules**: Modular content system not yet implemented.
5. **Revision History**: Not yet implemented.

## After Testing
Once all tests pass:
1. Update feature_list.json
2. Mark test #11 ("Create new page with basic content") as passing
3. Document any bugs found
4. Proceed with next features (TipTap editor, media library, etc.)
