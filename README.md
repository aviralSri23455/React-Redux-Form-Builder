# React + Redux Form Builder

A dynamic form builder application built with React, TypeScript, Redux Toolkit, Material-UI, and localStorage. This application allows users to create custom forms with advanced features like derived fields, validation rules, and real-time preview.

## 🚀 Features

### 📝 Form Builder (/create)
- **Dynamic Field Types**: Support for 7 different field types
   - Text input, Number input, Textarea
   - Select dropdown, Radio buttons, Checkboxes, Date picker

- **Field Configuration**:
   - Custom labels and required field toggle
   - Default values and advanced validation rules
   - Not empty, min/max length, email format, password rules

- **Derived Fields**:
   - Smart fields that auto-calculate based on other fields
   - Age calculation from birth date, Sum of numeric fields
   - Text concatenation, Custom formula support

- **Form Management**:
   - Drag and drop field reordering (now with subtle spring animation & ghost placeholder)
   - Field deletion with confirmation
   - Form saving with custom names
   - Auto-save & Draft Recovery (1s debounce, restore prompt on revisit)

- **Theming & Density**:
   - Instant Dark / Light mode toggle (floating button)
   - Compact / Comfortable density toggle (reduced paddings for dense data entry)
   - Theme persists during session (state driven)

- **Accessibility & Motion**:
   - Respects user `prefers-reduced-motion` (animations disabled / simplified)
   - Keyboard-friendly structure (focusable actionable elements)

- **Polished Interactions**:
   - Animated field reordering
   - Pop / pulse feedback on drop
   - Staggered entrance for fields

### 👀 Form Preview (/preview)
- **Live Form Rendering**: Exact representation of end-user experience
- **Real-time Validation**: Field-level validation with error messages
- **Derived Field Updates**: Auto-calculation as user types
- **Progress Tracking**: Visual progress indicator
- **Dark / Light aware**: Preview automatically reflects current theme

### 📊 My Forms Dashboard (/myforms)
- **Form Gallery**: Grid layout of all saved forms
- **Animated Cards**: Spring entrance + staggered reveal (masonry feel)
- **Form Information**: Name, creation date, question count
- **Form Actions**: One-click preview, deletion with confirmation
- **localStorage Integration**: Persistent form storage
- **Reduced Motion Support**: Disables movement if user prefers

## 🛠️ Technical Stack

- **Frontend**: React 19 + TypeScript
- **State Management**: Redux Toolkit
- **UI Framework**: MUI v7 (Material-UI)
- **Animations**: Framer Motion (spring layout, presence, reduced-motion handling)
- **Routing**: React Router v7
- **Date Handling**: date-fns
- **Build Tool**: Vite
- **Storage**: localStorage (no backend required)
- **Persistence Helpers**: Debounced draft auto-save utilities

## 🔧 Installation & Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## ⚡ Quick Start After Clone

```bash
# 1. Clone repository
git clone <your-repo-url>.git
cd builder

# 2. Install dependencies
npm install

# 3. Run locally (http://localhost:5173)
npm run dev

# 4. (Optional) Type check & lint
npm run lint

# 5. Create production build (outputs to /dist)
npm run build

# 6. Preview the production build locally
npm run preview
```

Nothing else is required. No environment variables are needed. All data is stored in `localStorage`.

## 🌐 Deployment (Vercel)

This project is a Vite + React SPA (single-page application). Configure Vercel to build and serve the `dist` directory with client-side routing fallback.

### 1. Add `vercel.json` (already provided below)
```json
{
   "version": 2,
   "builds": [
      { "src": "index.html", "use": "@vercel/static-build", "config": { "distDir": "dist" } }
   ],
   "routes": [
      { "handle": "filesystem" },
      { "src": "/.*", "dest": "/index.html" }
   ]
}
```

### 2. Vercel Project Settings
- Framework Preset: `Other` (or detect Vite)
- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm install` (default)
- Node Version: Use Vercel default (supports React 19)

### 3. Deploy Steps
1. Push code to GitHub (or GitLab/Bitbucket)
2. Import the repo in Vercel dashboard
3. Ensure the build/output settings match above
4. Deploy – first build will create `dist`
5. Visit generated URL (e.g. https://your-app.vercel.app)

### 4. SPA Routing Note
The `routes` section in `vercel.json` ensures all non-file requests fallback to `index.html`, allowing React Router to handle routes like `/create`, `/preview`, `/myforms`.

### 5. Cache Busting / Re-deploy
Any commit pushed to the connected branch (e.g. `main`) triggers a new deployment.

### 6. Optional Optimizations
- Enable Vercel Analytics (no code change required)
- Add a `robots.txt` if you want to control indexing
- Add a custom domain via Vercel dashboard

### 7. Troubleshooting Deployment
- Blank page? Make sure fallback route to `index.html` exists
- 404 on refresh? Indicates missing route rewrite (check `vercel.json`)
- Stale assets? Hard refresh (Ctrl+F5) or purge Vercel cache by re-deploying
- Slow initial load? Check bundle analysis with `npm run build` and verify code splitting is working

### 8. Bundle Size Optimization
The project includes automatic code splitting:
- **Vendor chunk**: React, React DOM, React Router
- **Redux chunk**: Redux Toolkit and React-Redux
- **UI chunk**: MUI components and styling
- **Motion chunk**: Framer Motion animations
- **Utils chunk**: Date handling and other utilities

This splits the large bundle into smaller, cacheable chunks that load faster.

---

## 📋 Usage Guide

### Creating a Form
1. Navigate to `/create`
2. Enter form title and click "Add question"
3. Configure field type, label, validation rules
4. Set as derived field if needed
5. Reorder by dragging, save with custom name

### Previewing Forms
1. Navigate to `/preview`
2. Fill out form with real-time validation
3. See derived field calculations
4. Submit for success feedback

### Managing Saved Forms
1. Navigate to `/myforms`
2. View all forms in grid layout
3. Click form cards to preview
4. Use delete button to remove forms

## 🔍 Advanced Features

### Derived Fields
- **Age from Birth Date**: Auto-calculates age
- **Sum Fields**: Adds numeric field values
- **Concatenation**: Combines text fields
- **Custom Formulas**: JavaScript expressions with built-in functions (sum, multiply, concat)

### Validation System
- Required field validation
- String length constraints (min/max)
- Email format validation
- Password strength requirements
- Custom pattern matching
- Number range validation

### Additional Features
- **Drag & Drop**: Reorder form fields easily (with animated transitions & ghost placeholder)
- **Real-time Preview**: See changes instantly
- **localStorage Persistence**: No backend required
- **Auto-Save Drafts**: Background save + restore prompt
- **Theme & Density Toggles**: Dark/Light & Compact/Comfort controls
- **Form Analytics**: Track completion progress
- **Responsive Design**: Works on all devices
- **Reduced Motion Respect**: Animations simplified when requested by OS
- **Error Handling**: Comprehensive validation feedback

## 🧪 Testing Guide

### 💾 Testing Auto-Save & Draft Recovery
1. **Create Form with Auto-Save**
   - Navigate to `http://localhost:5173/create`
   - Enter form title: "Test Auto-Save Form"
   - Add a few fields (name, email, etc.)
   - Watch browser console for draft save messages

2. **Test Draft Restoration**
   - Refresh the page or close/reopen browser
   - You should see a "Draft Form Found" alert
   - Click "Restore Draft" to continue editing
   - Or click "Dismiss" to start fresh

3. **Test Draft Cleanup**
   - Create form with auto-save
   - Save the form with a name
   - Refresh page - no draft alert should appear

### 📝 Testing Form Creation
1. **Navigate to Create Page**
   ```
   http://localhost:5173/create
   ```

2. **Create a Basic Form**
   - Click "Add Field" button
   - Choose "Text" field type
   - Set label as "Full Name"
   - Check "Required" checkbox
   - Click "Save Field"

3. **Add Different Field Types**
   - Add Number field: "Age" (required)
   - Add Email field: "Email Address" (required)
   - Add Select field: "Country" with options (USA, Canada, UK)
   - Add Date field: "Birth Date"
   - Add Textarea: "Comments" (optional)

4. **Test Field Reordering**
   - Drag fields up/down using drag handles
   - Verify order changes in preview

5. **Save the Form**
   - Click "Save Form" button
   - Enter form name: "Sample Registration Form"
   - Confirm save success message

### 🔬 Testing Derived Fields

## ✅ Correct Workflow for Derived Fields:

### Step 1: Create ONE form with MULTIPLE regular fields
1. Go to `/create`
2. Enter form title: "Registration Form"
3. **Add multiple regular fields to the SAME form:**

**Field 1:**
- Click "Add Field"
- Type: Date
- Label: "Birth Date"
- Required: Yes
- **DON'T check "Derived Field"**
- Click "Add Field"

**Field 2:**
- Click "Add Field"
- Type: Number
- Label: "Score 1"
- Required: Yes
- **DON'T check "Derived Field"**
- Click "Add Field"

**Field 3:**
- Click "Add Field"
- Type: Number
- Label: "Score 2"
- Required: Yes
- **DON'T check "Derived Field"**
- Click "Add Field"

### Step 2: Now add a derived field to the SAME form
**Field 4 (Derived):**
- Click "Add Field"
- Type: Number
- Label: "Calculated Age"
- **NOW check "Derived Field"**
- Select Formula Type: "Age from Birth Date"
- Parent Fields dropdown will now show: "Birth Date"
- Select "Birth Date"
- Click "Add Field"

### Step 3: Add another derived field
**Field 5 (Derived):**
- Click "Add Field"
- Type: Number
- Label: "Total Score"
- **Check "Derived Field"**
- Select Formula Type: "Sum Fields"
- Parent Fields dropdown will show: "Score 1", "Score 2"
- Select both fields
- Click "Add Field"

**Important Notes:**
- ❌ **DON'T** create separate forms for each field
- ✅ **DO** create multiple fields within the SAME form
- ✅ **DO** create regular fields FIRST, then derived fields
- ✅ The parent field dropdown will only show fields from the current form

3. **Test Custom Formula**
   - Add derived field: "Custom Calculation"
   - Formula type: "Custom Formula"
   - Enter formula using actual field IDs (see example below)
   - Select parent fields (must be numeric fields)
   - Save field
   - Go to preview and test with sample values

4. **Test Advanced Custom Formulas**
   - **Finding Field IDs**: Submit your form and check browser console for field IDs
     - Example output: `{field_1754754848309_69gvvu8dg: '20', field_1754754876397_lmgaghjet: '30'}`
   - Formula examples using real field IDs:
     - `field_1754754848309_69gvvu8dg + field_1754754876397_lmgaghjet` (simple addition)
     - `sum(field_1754754848309_69gvvu8dg, field_1754754876397_lmgaghjet)` (using built-in function)
     - `multiply(field_1754754848309_69gvvu8dg, 2)` (multiplication with constant)
     - `sum(field_1754754848309_69gvvu8dg, field_1754754876397_lmgaghjet) / 2` (average)

   **How to get Field IDs:**
   1. Create your regular fields first
   2. Go to preview, fill out the form, and submit
   3. Check browser console for the submitted values object
   4. Copy the exact field IDs (like `field_1754754848309_69gvvu8dg`) into your custom formulas

### ✅ Testing Validation Rules
1. **Required Field Validation**
   - Leave required fields empty
   - Try to submit form
   - Verify error messages appear

2. **Email Validation**
   - Enter invalid email: "notanemail"
   - Verify format error appears
   - Enter valid email: "test@example.com"
   - Verify error disappears

3. **Length Validation**
   - Add validation rule: Min length 5, Max length 20
   - Test with "ab" (too short)
   - Test with very long text (too long)
   - Test with valid length

4. **Number Range Validation**
   - Add validation rule: Min 18, Max 65
   - Test with 15 (too low)
   - Test with 70 (too high)
   - Test with 25 (valid)

### 🎯 Testing Form Preview (Theme & Motion)
1. **Navigate to Preview**
   ```
   http://localhost:5173/preview
   ```

2. **Test Real-time Validation**
   - Fill out form fields
   - Watch for immediate error feedback
   - See validation icons (✓ ✗)

3. **Test Derived Field Updates**
   - Enter birth date: "1990-01-15"
   - Watch age field auto-calculate
   - Change birth date, verify age updates

4. **Test Form Submission**
5. **Toggle Dark Mode**
   - Use floating toggle button (bottom/right) to switch
   - Verify colors, surfaces, and contrast adapt
6. **Toggle Density**
   - Use compact/comfort toggle button
   - Check reduced paddings & tighter inputs
7. **Reduced Motion**
   - In OS accessibility settings enable “Reduce Motion”
   - Reload app: field reorder + card entrances should no longer animate (opacity-only)
   - Fill all required fields correctly
   - Click "Submit Form"
   - Verify success message
   - Check console for submitted data

### 📊 Testing Dashboard (Animated Cards)
1. **Navigate to My Forms**
   ```
   http://localhost:5173/myforms
   ```

2. **Verify Saved Forms**
   - See all previously saved forms
   - Check form cards show: name, date, field count
   - Verify responsive grid layout

3. **Test Form Actions**
4. **Observe Animations**
   - Cards appear with staggered spring entrance
   - Delete a form to see exit animation (if motion not reduced)
   - Click form card to preview
   - Use delete button to remove forms
   - Confirm deletion dialog works

### 🔧 Testing localStorage
1. **Browser Developer Tools**
   ```javascript
   // Check saved forms
   JSON.parse(localStorage.getItem('formBuilder_savedForms'))
   
   // Clear storage (if needed)
   localStorage.clear()
   ```

2. **Test Persistence**
   - Create and save forms
   - Refresh browser
   - Verify forms still appear in dashboard
   - Close/reopen browser tab
   - Confirm data persists

### 🐛 Common Testing Scenarios
1. **Edge Cases**
   - Create form with no fields
   - Try saving without form name
   - Delete all form fields
   - Submit empty form

2. **Error Scenarios**
   - Enter special characters in fields
   - Try extremely long form names
   - Test with disabled JavaScript
   - Test on mobile devices

3. **Performance Testing**
   - Create form with 20+ fields
   - Add many derived fields
   - Test form with complex formulas
   - Check responsiveness with large datasets

### 📱 Cross-Device & Motion / Theme Testing
1. **Desktop Browsers**
   - Chrome, Firefox, Safari, Edge
   - Test different screen resolutions
   - Verify drag-and-drop works

2. **Mobile Testing**
   - Test on smartphones/tablets
   - Verify touch interactions
   - Check responsive layout
   - Test form submission on mobile

### 🎨 UI/UX + Theme & Motion Testing
1. **Visual Testing**
   - Check Microsoft-inspired design
   - Verify blue color scheme (#0078d4)
   - Test button hover effects
   - Confirm card animations work

2. **Accessibility Testing**
3. **Reduced Motion Verification**
   - Confirm no large translate / scale animations
   - Only opacity changes remain
4. **Dark/Light Verification**
   - Contrast ratios remain acceptable in both themes
   - Tab through all form elements
   - Test with screen readers
   - Verify proper ARIA labels
   - Check color contrast ratios

## 🔧 Troubleshooting

### Common Issues & Solutions

#### Forms Not Saving to Dashboard
```javascript
// Check localStorage in browser console
console.log('Saved forms:', JSON.parse(localStorage.getItem('formBuilder_savedForms') || '[]'));

// Clear localStorage if corrupted
localStorage.removeItem('formBuilder_savedForms');
```

#### Derived Fields Not Calculating
- Ensure parent fields have valid values
- Check formula syntax for custom formulas
- Verify parent field selection is correct
- Check browser console for JavaScript errors
- **For Custom Formulas**: Use actual field IDs, not generic names like `field1`
  - Wrong: `sum(field1, field2)`
  - Right: `sum(score1, score2)` (using actual field IDs from your form)

#### Custom Formula Errors
If you see "field1 is not defined" errors:
```javascript
// Check your field IDs in browser console after form submission
// Example output: {field_1754754848309_69gvvu8dg: '20', field_1754754876397_lmgaghjet: '30'}

// Use these exact IDs in your formulas:
// Right: sum(field_1754754848309_69gvvu8dg, field_1754754876397_lmgaghjet)
// Wrong: sum(field1, field2)
```
- Custom formulas must reference the exact auto-generated field IDs
- Field IDs follow pattern: `field_[timestamp]_[random]` (e.g., `field_1754754848309_69gvvu8dg`)
- **Easy way to find IDs**: Submit your form and check console output
- Use the parent field selector dropdown to see available field names

#### Validation Not Working
- Ensure field types match validation rules
- Check required field settings
- Verify email format is correct
- Test with different input values

#### Build/Development Issues
```bash
# Clear node modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear Vite cache
rm -rf .vite
npm run dev

# Check bundle sizes after build
npm run build
# Look for chunk breakdown in terminal output
```

#### Large Bundle Warning
If you see "chunks are larger than 500 kB" warning:
- This is normal for development - the app uses code splitting
- Production builds are automatically optimized with separate chunks
- Vercel serves with gzip compression (reduces ~895KB to ~277KB)
- First load downloads main chunk, subsequent pages load smaller chunks

### Browser Compatibility
- **Supported**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Features**: ES2020, localStorage, Drag & Drop API
- **Recommended**: Latest Chrome for best performance

## 🏗️ Project Architecture

### Component Structure
```
src/
├── components/
│   ├── FormBuilder/          # Form creation interface
│   │   ├── index.tsx         # Main form builder
│   │   ├── FieldItem.tsx     # Individual field component
│   │   └── FieldConfigDialog.tsx # Field configuration modal
│   ├── FormRenderer/         # Form preview/display
│   │   ├── index.tsx         # Main form renderer
│   │   └── FormFieldRenderer.tsx # Individual field renderer
│   └── Layout/               # App layout components
├── pages/                    # Route components
├── store/                    # Redux state management
├── types/                    # TypeScript definitions
├── utils/                    # Helper functions
└── App.tsx                   # Main application
```

### Key Features Implementation
- **State Management**: Redux Toolkit with createSlice
- **Form Validation**: Custom validation utility with multiple rule types
- **Persistence**: localStorage with JSON serialization + debounced draft auto-save
- **Drag & Drop**: HTML5 Drag and Drop API with animated reorder (Framer Motion layout)
- **Derived Fields**: Real-time calculation engine (age, sum, concat, custom formulas)
- **Theming**: Material-UI dynamic theme factory (dark/light + density)
- **Motion System**: Framer Motion layout / presence + reduced-motion gate
- **Animations**: Field reorder ghost, drop pulse, staggered list & dashboard card entrances
- **Code Splitting**: Vite manual chunks + React lazy loading for optimal bundle sizes
- **Performance**: Route-based splitting, vendor library separation, async component loading

## 🎨 Microsoft Forms Inspired Design
- Clean, modern interface
- Segoe UI font family
- Microsoft blue color scheme (#0078d4)
- Card-based layout with smooth, spring animations
- Dark / Light adaptive palette
- Compact density mode for data-heavy workflows
- Responsive design for all devices
- Accessibility-first approach (reduced motion support)

## 📈 Performance Features
- **Optimized Rendering**: React.memo for field components
- **Efficient State Updates**: Redux Toolkit optimizations
- **Lazy Loading**: Route-based code splitting (CreatePage, PreviewPage, MyFormsPage)
- **Bundle Optimization**: Manual chunking for vendor libraries (React, MUI, Redux, Framer Motion)
- **localStorage Caching**: Fast form retrieval
- **Debounced Validation & Auto-Save**: Smooth user & storage performance
- **Selective Animation**: Motion disabled when not needed (battery/accessibility friendly)
- **Code Splitting**: Separate chunks for UI libraries, state management, and utilities
- **Async Loading**: Pages load on-demand with fallback indicators

# Output Screen Shot 
![Alt text](./Image%20output/console%20ss-2.PNG)

![Alt text](./Image%20output/console%20ss.PNG)

