# Ella:Your journaling Companion. 

![ella-high-resolution-logo-transparent](https://github.com/user-attachments/assets/d865b0d5-93ca-4f98-9866-298f41e5cc27)


A no- frills journaling app with the ability to see mood changes over time.

Meet Ella, your new journaling buddy that gets you. Think of it as your personal guide to navigating the ups and downs of life. With Ella, you’ll find a treasure trove of personalized mental health prompts tailored just for you. Whether you’re looking to unpack a tough day, celebrate a small win, or just check in with yourself, Ella is here to help.

# What’s inside Ella?
Mood Selector: Kick off your journaling by choosing from five moods, each paired with a unique emoji and gradient. Whether you’re feeling great or doomed, there’s a perfect fit for your day.

Intuitive Journaling: Jot down your thoughts in a beautifully designed space that feels inviting, whether you’re venting about a rough day or celebrating a small win. With just a click, create new entries and keep track of how you’re feeling over time.

Personalized Themes: Light or dark? You choose! Ella allows you to toggle between themes effortlessly, enhancing your experience and keeping things visually fresh. Your preference is saved, so you can pick up right where you left off.

Calendar Overview: Dive into your past entries with a sleek calendar sidebar. Highlighted days show you when you’ve logged your feelings, making it easy to revisit moments and reflect on your journey.

Settings for You: Adjust your profile, manage your preferences, and personalize your experience. It’s all about making Ella feel like your space.

Smooth Animations: Transitions between screens and actions are seamless, thanks to clever animations. You won’t just use Ella; you’ll enjoy it.

# What makes Ella special? (coming soon)
Tailored Prompts : Forget generic questions. Ella learns what resonates with you, delivering prompts that feel like they were crafted just for your unique journey.

Mood Tracking: Keep tabs on your emotions over time. With Ella, you can easily see patterns and gain insights into what truly makes you tick.

Reflection Spaces: Dive deeper into your thoughts with dedicated spaces for reflection, helping you cultivate self-awareness and personal growth.

Gentle Reminders : Life gets busy. Ella nudges you gently when it’s time to pause and reflect, making self-care feel effortless.

So, if you’re ready to turn the page on stress and dive into a journey of self-discovery, give Ella a shot. It’s not just about journaling; it’s about connecting with yourself in a way that feels real and meaningful. No pressure, just you and Ella—let’s explore your mind together!

![WhatsApp Image 2024-10-09 at 14 51 21_3d2c9f60](https://github.com/user-attachments/assets/487214dd-da3f-4033-9720-1345f365c325)





# Ella App Devlog: From Twine Prototype to React v1.15

--Version 0.1 – Twine Prototype--
The journey of Ella began with a simple but powerful goal: to create a personal journal app focused on mental health and emotional reflection. The initial version of Ella was developed in Twine, a tool primarily used for interactive storytelling. This approach enabled us to map out the narrative flow, test mood-based journaling mechanics, and understand user interaction patterns in a structured, textual format.

Key Features:

Mood Selection: Users could select a mood to begin a journal entry, with pre-written prompt options for each mood.
Basic Prompt System: Prompts varied depending on the mood chosen, gently guiding users into expressive journaling.
Entry Log: The app stored simple, text-based entries with no external storage, allowing for basic testing and flow verification.
Version 1.0 – React Implementation
With the basic structure mapped out in Twine, we moved Ella to a React environment to achieve scalability, dynamic functionality, and a more polished UI. The first React version included foundational components but was fairly minimal.

Key Features:

Mood Selector: Enhanced visual design and simplified dropdown for mood selection.
Journal Entry Interface: A simple text box and submission flow.
Static Prompts: Initial prompt selection retained from Twine, providing basic guidance.

--Version 1.05 – UI & UX Overhaul--
This version marked a significant step in improving user experience by refining visuals, interactions, and response times. The design was updated for better readability, introducing a clean, minimalist interface that aligned with Ella's mission of fostering mental well-being.

Improvements:

Mood-Specific Prompts: We introduced more refined prompts based on common mood categories.
Basic Calendar Sidebar: Enabled users to view past entries at a glance.
Improved Text Input: Enhanced journaling experience with expanded input area and streamlined submission.

--Version 1.07 – Introducing Pattern Recognition and Dynamic Prompts--
In response to user feedback, we recognized the need for Ella to be more responsive and reflective of users’ past entries. This update was a major step forward in making Ella an intuitive journaling companion.

Key Features:

Pattern Recognition for Prompts:

A new getSuggestedPrompt function suggested prompts based on historical entries, considering both weekday patterns and recent mood frequency.
Users now received more personalized prompts that gently encouraged reflection on recurring emotional states.
Enhanced Calendar Sidebar:

Mood Emojis: Displayed alongside each date, showing the mood logged on that day, giving users a visual representation of mood patterns over time.
Responsive Design: The sidebar transitioned between a sidebar on large screens and an overlay on smaller devices, enhancing accessibility across platforms.
Settings Improvements:

Danger Zone: Added the option to delete all entries with a confirmation dialog to prevent accidental data loss.
Accessibility Updates: Enhanced keyboard navigation and improved color contrast, making Ella more inclusive and user-friendly.
Responsive Layout: Adapted the UI to different screen sizes, including mobile-friendly features.

--Version 1.15 – Streamlining with Improved Chat Interface and Accessibility--
This latest version, v1.15, focuses on refining user interaction through a new chat-based journaling flow, taking inspiration from social media and messaging platforms.

New Features & Enhancements:

Chat Log Interface:

Historical Entries Display: Users can view previous entries in a chronological chat format, making it easier to revisit past reflections.
New Entry Prompts: The "New Entry" button now leverages getSuggestedPrompt for an even more intuitive journaling flow, providing prompts that feel natural and easy to engage with.
Finalized Pattern Recognition:

Day-of-Week and Mood Frequency Matching: Improved prompt suggestions based on the day of the week or dominant mood frequency, allowing Ella to suggest prompts that truly resonate with users.
Settings Enhancements:

Expanded “Danger Zone” with additional warnings and safeguards to protect user data, aligning with feedback for improved data management options.
Accessibility & Responsiveness:

Additional aria-labels and keyboard focus indicators for visually impaired users.
Enhanced responsive behavior for all components, with the calendar switching seamlessly between sidebar and overlay modes based on screen width.

--Looking Forward--
With v1.15, Ella has evolved from a simple Twine prototype to a sophisticated React-based journaling app. The goal for future updates is to make Ella even more adaptive, perhaps incorporating additional prompt patterns, theme customization, and advanced data insights that promote mindfulness and self-reflection. As always, user feedback will play a central role in shaping Ella's journey toward becoming a truly supportive mental health tool.


Custom Software License


Copyright (c) [2024] [Tehillah Kachila]

1. Permission is hereby granted to use, modify, and distribute this software for non-commercial purposes.
2. The author retains exclusive rights to commercially distribute this software.
3. Contributions are welcome, but contributors must submit contributions under this license.
4. Any modifications or derivative works must also be made available under this license.

This license does not grant permission for others to sell or distribute their own versions of this software.
