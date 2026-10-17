Improve only the existing frontend. Do not change the overall design language, architecture, or folder structure.

Implement the following changes:

1. Sidebar Collections

- Add a dedicated "Collections" section in the sidebar.
- Display all available collections.
- Selecting a collection should filter the displayed content.
- Highlight the currently selected collection.
- If there are many collections, make the sidebar section scrollable instead of overflowing.

2. Content Filters

- Add filtering options above the content grid.
- Include at least:
  - Sort by Newest
  - Sort by Oldest
  - Filter by Collection
- The filters should work together and update the displayed content.

3. Fix Overflow Issues

- There should never be horizontal scrolling (overflow-x) anywhere in the application.
- Long titles, URLs, tags, or content should wrap or truncate gracefully.
- Cards should resize properly on smaller screens.
- Ensure the layout remains responsive without breaking.

4. Bento Grid Layout

- Replace the current card layout with a modern Bento Grid.
- Cards should have varying sizes based on their content while maintaining a clean, balanced layout.
- The grid should adapt seamlessly across mobile, tablet, and desktop screens.
- Maintain consistent spacing and alignment.

5. Individual Card Page

- Clicking any content card should navigate to a dedicated page for that item.
- This page should display the complete information about the selected content, including all metadata available from the backend.
- Include actions such as Edit, Delete, Share, and Copy Link if supported.

6. Share Brain Experience

- Improve the sharing flow.
- When the user shares their brain:
  - Display the generated shareable link in a dialog or modal.
  - Provide a "Copy Link" button.
  - After copying, show a success toast such as "Share link copied to clipboard."
  - Also allow the user to manually view and copy the generated URL.

Maintain the existing UI theme:

- Clean
- Minimal
- Professional
- Productivity-focused
- Responsive
- Tailwind CSS
- shadcn/ui components where appropriate

Do not introduce unnecessary complexity or modify unrelated parts of the application.
