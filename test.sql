-- Insert sample data into Category table
INSERT INTO Category (id, idx, name, icon) VALUES
                                               ('cat1', 1, 'Work', 'briefcase'),
                                               ('cat2', 2, 'Personal', 'user'),
                                               ('cat3', 3, 'Study', 'book');

-- Insert sample data into Status table
INSERT INTO Status (id, idx, name, color, text, icon) VALUES
                                                          (1, 1, 'To Do', '#FF0000', 'Not Started', 'circle'),
                                                          (2, 2, 'In Progress', '#FFA500', 'Working on it', 'clock'),
                                                          (3, 3, 'Completed', '#008000', 'Finished', 'check');

-- Insert sample data into Tag table
INSERT INTO Tag (id, idx, name) VALUES
                                    ('tag1', 1, 'Urgent'),
                                    ('tag2', 2, 'Important'),
                                    ('tag3', 3, 'Low Priority');

-- Insert sample data into Post table (representing tasks)
INSERT INTO Post (id, categoryId, title, company, user_id, status, description, created_at, updated_at) VALUES
                                                                                                            ('post1', 'cat1', 'Complete project report', 'ACME Corp', 'user1', 1, 'Finish the quarterly project report', datetime('now'), datetime('now')),
                                                                                                            ('post2', 'cat2', 'Buy groceries', 'Personal', 'user1', 2, 'Get milk, eggs, and bread', datetime('now'), datetime('now')),
                                                                                                            ('post3', 'cat3', 'Study for exam', 'University', 'user2', 1, 'Review chapters 1-5 for upcoming test', datetime('now'), datetime('now'));

-- Insert sample data into _PostToTag table (associating tasks with tags)
INSERT INTO _PostToTag (A, B) VALUES
                                  ('post1', 'tag1'),
                                  ('post1', 'tag2'),
                                  ('post2', 'tag3'),
                                  ('post3', 'tag2');

-- Insert sample data into Upvote table
INSERT INTO Upvote (user_id, post_id) VALUES
                                          ('user2', 'post1'),
                                          ('user3', 'post1'),
                                          ('user1', 'post3');