Update the existing frontend without changing the overall architecture, folder structure, or design language. Keep the UI clean, minimal, professional, and responsive.

Implement the following improvements:

1. Rename the Application

- Change the application name from **Second Brain** to **Brain Dock** everywhere in the application.
- Update the navbar, landing page, page titles, metadata, logos (if text-based), and any other references.

2. Password Input

- Ensure password fields display masked characters (*) instead of visible text.
- Use the standard password input behavior with an appropriate placeholder.

3. Dashboard Spacing

- Add proper vertical spacing below the "Add Item" section/button so it doesn't appear cramped.
- Maintain consistent spacing throughout the dashboard.

4. Add Collection Button

- Add a clearly visible **"Add Collection"** button.
- The button should open an appropriate dialog/modal for creating a new collection.
- Validate the form and provide proper success/error feedback.

5. Delete Feedback

- Whenever an item or collection is deleted successfully, display a toast notification.
- Example:
  - "Content deleted successfully."
  - "Collection deleted successfully."

6. AI Search Improvements

- The AI search is functioning correctly, but improve the search results.
- Include semantically related and contextually relevant content based on the backend's AI recommendations/model output.
- Results should not be limited to exact keyword matches.
- Display the most relevant content first.

7. Share Brain Page

- Create a dedicated **Share Brain** page if it does not already exist.
- The page should:
  - Display whether sharing is enabled.
  - Allow enabling/disabling sharing.
  - Show the generated public share link.
  - Include a "Copy Link" button.
  - Show a success toast after copying.
  - Allow users to manually copy or open the shared URL.

8. Filter by Tags

- Add filtering by tags.
- Users should be able to:
  - Select one or multiple tags.
  - Combine tag filters with collection and date filters.
  - Clear all applied filters easily.

9. Profile Avatar

- Replace the generic profile image with an avatar displaying the user's initials.
- Example:
  - Vishesh Verma → VV
  - John Doe → JD
- If a profile image is later added, display it instead of the initials.

General Requirements

- Maintain the current design system and responsiveness.
- Use Tailwind CSS and shadcn/ui components where appropriate.
- Keep all existing functionality intact.
- Do not modify unrelated parts of the application.
- Ensure proper loading, empty, and error states for all new features.
- Continue following clean architecture and reusable component practices.
