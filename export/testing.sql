-- Insert command for Status table
-- INSERT INTO Status (id, idx, name, color, text, icon)
-- VALUES (-1, 5, 'Under Review', '#f59e0b', 'App is being tested', 'OpenRegular');

DELETE FROM Post WHERE id = '3bc9bd8d-fcc2-4f04-9a63-e8f1f9a73009';
DELETE FROM Post WHERE id = '7df5f458-0ac6-4060-8982-901a480e0506';
DELETE FROM Post WHERE id = '20b671a7-a347-4b2b-a2ed-0abe731e343e';
DELETE FROM Post WHERE id = '86f1dc6c-9d18-4c94-8764-a457995e8ec9';

-- Insert commands for Post table
INSERT INTO Post (
    id, categoryId, title, company, user_id, status, status_hint, description,
    app_url, community_url, banner_url, icon_url, created_at, updated_at, update_description
) VALUES (
             '3bc9bd8d-fcc2-4f04-9a63-e8f1f9a73009',
             '0236adbb-d1ae-4abd-89ec-6204179e7bb6',
             'Guitar Rig 5',
             'Native Instruments',
             'user_2lXE2epviDt7jl9nbbMid8AnMb8',
             -1,
             -1,
             'Guitar Rig 5 is a software developed by Native Instruments, designed for guitarists and bass players who want to enhance their sound digitally. It offers a comprehensive suite of effects, amps, cabinets, and customization options that replicate physical gear setups. Musicians can simulate classic amplifiers, tweak effects like reverb, delay, and distortion, and organize their signal chain just like they would with physical equipment. Guitar Rig 5 also includes a variety of presets to jump-start creativity and is widely used in studios for its versatility and ease of use. The software is compatible with both live performance and recording environments, making it a go-to choice for professional and hobbyist musicians alike.',
             NULL,
             NULL,
             NULL,
             NULL,
             '2024-09-02T22:58:07.372+00:00',
             '2024-09-02T22:58:07.372+00:00',
             NULL
         );

INSERT INTO Post (
    id, categoryId, title, company, user_id, status, status_hint, description,
    app_url, community_url, banner_url, icon_url, created_at, updated_at, update_description
) VALUES (
             '7df5f458-0ac6-4060-8982-901a480e0506',
             'c1343ca4-d817-471e-86a7-511a6d333908',
             'Studio 3T',
             '3T Software Labs Ltd',
             'user_2kkoUqRqkx2InY0b3Q4YHboEBzp',
             -1,
             1,
             'MongoDB client vs. MongoDB GUI vs. MongoDB IDE
         So what exactly is Studio 3T? Here we explain three of the many hats it wears.

         Studio 3T as a MongoDB client
         A client is a software program or application that allows you to connect to a server. Go wild with Studio 3T''s Connection Manager and connect to as many MongoDB servers as you need.


         Studio 3T as a MongoDB GUI
         A Graphical User Interface (GUI) does exactly as it says. It provides a user interface with graphical menus, icons, dialogs, wizards, and other visual elements. The alternative to using a MongoDB GUI would be to use the mongo shell, though Studio 3T still has IntelliShell – an easy-to-navigate, built-in version – for when you need one.


         Studio 3T as a MongoDB IDE
         An Integrated Development Environment (IDE) consolidates the many aspects of application and database development into one fully-featured "studio" environment. Studio 3T does exactly that by providing a GUI that has editors with auto-completion and syntax highlighting, built-in JSON validation, automatic query code generation in seven languages, and many other features that help you work faster and save time.',
             'https://studio3t.com/',
             NULL,
             NULL,
             'https://studio3t.com/wp-content/themes/s3t-2020/images/logo-pos.svg',
             '2024-09-04T10:14:39.125+00:00',
             '2024-09-04T10:14:39.125+00:00',
             NULL
         );

INSERT INTO Post (
    id, categoryId, title, company, user_id, status, status_hint, description,
    app_url, community_url, banner_url, icon_url, created_at, updated_at, update_description
) VALUES (
             '20b671a7-a347-4b2b-a2ed-0abe731e343e',
             'c1343ca4-d817-471e-86a7-511a6d333908',
             'FreeCAD',
             'The FreeCAD Team',
             'user_2jRMYtOJu0NQtn1oVzekVXE2R8K',
             -1,
             -1,
             'FreeCAD is an open-source parametric 3D modeler made primarily to design real-life objects of any size. Parametric modeling allows you to easily modify your design by going back into your model history and changing its parameters.

         FreeCAD allows you to sketch geometry constrained 2D shapes and use them as a base to build other objects. It contains many components to adjust dimensions or extract design details from 3D models to create high quality production ready drawings.',
             'https://www.freecad.org/index.php',
             NULL,
             NULL,
             'https://www.freecad.org/svg/logo-freecad.svg',
             '2024-09-07T16:57:45.768+00:00',
             '2024-09-07T16:57:45.768+00:00',
             NULL
         );

INSERT INTO Post (
    id, categoryId, title, company, user_id, status, status_hint, description,
    app_url, community_url, banner_url, icon_url, created_at, updated_at, update_description
) VALUES (
             '86f1dc6c-9d18-4c94-8764-a457995e8ec9',
             'd8b46c04-2c3a-4fb0-9e8b-cb126c3ea8ca',
             'Zenless Zone Zero',
             'miHoYo, Inc.',
             'user_2lXmTZuRzWY4cZDafa9eYyh7mBk',
             -1,
             2,
             'Zenless Zone Zero  is a free-to-play action gacha game developed and published by miHoYo.',
             'https://zenless.hoyoverse.com/',
             NULL,
             NULL,
             'https://upload.wikimedia.org/wikipedia/en/9/92/Zenless_Zone_Zero_logo.png',
             '2024-09-08T10:35:21.548+00:00',
             '2024-09-08T10:35:21.548+00:00',
             NULL
         );
