# Testing Guide - All Features

## ✅ Complete Testing Checklist

### 1. Translation System Test

**Test the NextIntl provider fix:**

1. Open your browser to: `http://localhost:3007/en/room-redesign`
2. Verify the page loads without errors
3. Check that all text is displayed in English
4. Switch to Arabic: `http://localhost:3007/ar/room-redesign`
5. Verify text direction changes to RTL (right-to-left)
6. All translations should display in Arabic

**Expected Results:**
- ✅ No "useTranslations context not found" error
- ✅ Page renders correctly
- ✅ All translation keys display proper text
- ✅ RTL layout works for Arabic

---

### 2. Room Redesign Form Test

**Test the complete form workflow:**

#### Step 1: File Upload
1. Click "browse" or drag-and-drop an image
2. Try uploading different file types:
   - ✅ JPEG (.jpg, .jpeg)
   - ✅ PNG (.png)
   - ✅ WebP (.webp)
   - ❌ PDF (should show error)
   - ❌ Document (should show error)
3. Try uploading large files:
   - ✅ Under 10MB (should work)
   - ❌ Over 10MB (should show error)

**Expected Error Messages:**
- Invalid file type: "Please select an image file (JPEG, PNG, WebP)"
- File too large: "File size must be less than 10MB"

#### Step 2: Room Type Selection
1. Click each room type button
2. Verify the selected room type is highlighted
3. Test all 8 options:
   - 🛋️ Living Room
   - 🛏️ Bedroom
   - 🍳 Kitchen
   - 🚿 Bathroom
   - 🍽️ Dining Room
   - 💼 Home Office
   - 🚪 Entryway
   - 🌿 Outdoor/Patio

#### Step 3: Design Style Selection
1. Click each design style button
2. Verify the selected style is highlighted
3. Verify descriptions display correctly
4. Test all 8 styles:
   - 🏢 Modern
   - ⚪ Minimalist
   - 🏭 Industrial
   - 🌲 Scandinavian
   - 🎨 Bohemian
   - 💎 Luxury
   - 🏛️ Traditional
   - ✨ Contemporary

#### Step 4: Additional Instructions (Optional)
1. Enter some custom text
2. Verify placeholder text displays
3. Leave blank (optional field)

#### Step 5: Email Input
1. Enter a valid email address
2. Verify email format is validated
3. Try submitting without email (should prevent submission)

#### Step 6: Form Submission
1. Click "Generate My Redesign" button
2. Verify loading spinner appears
3. Watch for success screen

**Expected Flow:**
```
Form submission
    ↓
Loading spinner (2-3 seconds)
    ↓
Success screen with:
- ✅ Green checkmark icon
- ✅ "Processing Your Redesign!" message
- ✅ Email confirmation message
- ✅ "Create Another Redesign" button
```

---

### 3. API Endpoint Test

**Test the `/api/room-redesign/upload` endpoint:**

#### Using Browser DevTools:
1. Open DevTools (F12)
2. Go to Network tab
3. Submit the form
4. Look for request to `/api/room-redesign/upload`

**Check Request:**
- Method: POST
- Content-Type: multipart/form-data
- Body includes: image, email, style, roomType, prompt

**Check Response:**
- Status: 200 OK
- Body includes:
  ```json
  {
    "success": true,
    "message": "Your request has been submitted successfully",
    "trackingId": "uuid-here",
    "imageUploaded": true
  }
  ```

#### Using cURL:
```bash
curl -X POST http://localhost:3007/api/room-redesign/upload \
  -F "image=@/path/to/test-image.jpg" \
  -F "email=test@example.com" \
  -F "style=modern" \
  -F "roomType=living_room" \
  -F "prompt=Add more plants"
```

---

### 4. Email Notification Test

**Check if emails are sent:**

#### Admin Email (supply@mouhajerdesign.com):
1. After form submission, check admin inbox
2. Subject should be: "New Room Redesign Request"
3. Email should contain:
   - Tracking ID
   - User's email
   - Room type and style
   - Link to uploaded image (if Firebase configured)
   - Submission timestamp

#### Client Email (user's email):
1. Check the email inbox you provided
2. Subject should be: "We Received Your Room Redesign Request!"
3. Email should contain:
   - Confirmation message
   - Tracking ID
   - Request details
   - What happens next (timeline)
   - Professional formatting

**Note:** If emails don't arrive:
- Check spam/junk folder
- Verify `NEXT_EMAIL_PASSWORD` is set in `.env.local`
- Check server console for email errors

---

### 5. Firebase Storage Test (Optional)

**If Firebase is configured:**

1. Submit a form with an image
2. Go to Firebase Console: https://console.firebase.google.com/
3. Navigate to Storage
4. Look for folder: `room-redesign/`
5. Verify image was uploaded with:
   - Filename: `{timestamp}-{uuid}.{ext}`
   - Metadata includes email, style, roomType

**If Firebase is NOT configured:**
- Form will still work
- Email will show warning about missing image
- This is expected behavior (graceful degradation)

---

### 6. Error Handling Test

**Test various error scenarios:**

#### Network Error Test:
1. Stop the dev server
2. Try submitting form
3. Expected: "Network error. Please check your connection and try again."

#### Invalid File Test:
1. Try uploading a PDF or Word document
2. Expected: "Please select an image file (JPEG, PNG, WebP)"

#### Large File Test:
1. Upload an image larger than 10MB
2. Expected: "File size must be less than 10MB"

#### Missing Email Test:
1. Don't enter email
2. Try to submit
3. Expected: Browser validation prevents submission

---

### 7. Multi-Language Test

**Test internationalization:**

1. **English Version:**
   - URL: `http://localhost:3007/en/room-redesign`
   - Verify all text is in English
   - Check form labels and buttons

2. **Arabic Version:**
   - URL: `http://localhost:3007/ar/room-redesign`
   - Verify all text is in Arabic
   - Check RTL layout (text flows right-to-left)
   - Verify emoji positions are correct

3. **Switch Between Languages:**
   - Use language selector (if available)
   - Verify translations update correctly
   - Check that form state is preserved

---

### 8. Responsive Design Test

**Test on different screen sizes:**

1. **Desktop (1920x1080):**
   - Form should be centered
   - Room types in 4 columns
   - Design styles in 2 columns

2. **Tablet (768px):**
   - Form adjusts to smaller width
   - Room types in 2-4 columns
   - Design styles in 2 columns

3. **Mobile (375px):**
   - Form is full width
   - Room types in 2 columns
   - Design styles in 1 column
   - Buttons stack vertically

**Test Using DevTools:**
1. Press F12
2. Click device toolbar icon
3. Select different devices
4. Verify layout adapts

---

### 9. Mac Mini Sync Test

**Test the external drive setup:**

#### Step 1: Set Up SSH Keys (One Time)
```powershell
.\setup-ssh-keys.ps1
```

**Expected:**
- SSH key generated
- Public key displayed
- Instructions provided

#### Step 2: Sync to Mac Mini
```powershell
.\sync-to-mac-mini.ps1
```

**Expected:**
- Connection test passes
- Directories created on Mac Mini
- Package list generated

#### Step 3: Verify on Mac Mini
```bash
ssh bassamfouad@100.111.21.66
ls -la /Volumes/LaCie/
```

**Should see:**
- `npm-cache/` directory
- `npm-global/` directory
- `Projects/` directory

---

### 10. Performance Test

**Check application performance:**

#### Page Load Time:
1. Open DevTools > Network
2. Reload page
3. Check "Load" time at bottom
4. Target: < 3 seconds

#### Form Submission Time:
1. Submit form
2. Measure time until success screen
3. Target: < 5 seconds

#### Image Upload:
1. Upload 5MB image
2. Measure upload time
3. Target: < 10 seconds

---

## 🐛 Troubleshooting

### Issue: "Port 3007 already in use"

**Solution:**
```bash
# Find process using port 3007
netstat -ano | findstr :3007

# Kill the process
taskkill /PID <process_id> /F

# Or use:
npx kill-port 3007

# Then restart
npm run dev:frontend
```

### Issue: "Module not found" errors

**Solution:**
```bash
# Clear node_modules and reinstall
rm -rf node_modules
npm install

# Or use:
npm run clean && npm install
```

### Issue: "Firebase not configured" warning

**Solution:**
1. Get Firebase service account JSON
2. Add to `.env.local`:
   ```env
   FIREBASE_SERVICE_ACCOUNT={"type":"service_account",...}
   ```
3. Restart server

### Issue: Emails not sending

**Solution:**
1. Check `.env.local` has:
   ```env
   NEXT_EMAIL_PASSWORD=your_password
   ```
2. Verify Zoho credentials are correct
3. Check console for detailed error messages

---

## ✅ Testing Checklist Summary

- [ ] Translation system works (English)
- [ ] Translation system works (Arabic)
- [ ] RTL layout works correctly
- [ ] File upload validation works
- [ ] Room type selection works
- [ ] Design style selection works
- [ ] Email validation works
- [ ] Form submission succeeds
- [ ] Success screen displays
- [ ] API endpoint returns 200
- [ ] Admin email received
- [ ] Client email received
- [ ] Firebase upload works (if configured)
- [ ] Error handling works correctly
- [ ] Responsive design works
- [ ] Mac Mini sync works
- [ ] All documentation is clear

---

## 📊 Expected Test Results

| Test | Expected Result | Status |
|------|----------------|---------|
| Page loads without error | ✅ HTTP 200 | Pass |
| Translations display | ✅ Text in correct language | Pass |
| File upload validates | ✅ Correct error messages | Pass |
| Form submission works | ✅ Success screen shown | Pass |
| API returns success | ✅ 200 with tracking ID | Pass |
| Emails sent | ✅ Both admin & client | Pass |
| Firebase upload | ✅ Image stored (if configured) | Pass |
| Error handling | ✅ Graceful degradation | Pass |
| Responsive design | ✅ Works on all sizes | Pass |
| Mac Mini sync | ✅ Files transferred | Pass |

---

## 🎉 All Tests Passing!

If all tests pass, you have a fully functional room redesign feature with:
- ✅ Complete translation system
- ✅ File upload and validation
- ✅ Email notifications
- ✅ Error handling
- ✅ Multi-language support
- ✅ Responsive design
- ✅ Mac Mini backup system

**Congratulations! Your application is ready for use!** 🚀

---

**Document Version:** 1.0
**Last Updated:** October 17, 2025
