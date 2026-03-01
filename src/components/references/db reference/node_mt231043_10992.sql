-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Mar 01, 2026 at 11:59 AM
-- Server version: 10.6.23-MariaDB-0ubuntu0.22.04.1
-- PHP Version: 8.1.2-1ubuntu2.23

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `node_mt231043_10992`
--

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(120) NOT NULL,
  `description` text DEFAULT NULL,
  `color_code` varchar(12) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `exercises`
--

CREATE TABLE `exercises` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `skill_id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(200) NOT NULL,
  `step_by_step` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`step_by_step`)),
  `duration_minutes` smallint(5) UNSIGNED DEFAULT NULL,
  `requires_material` tinyint(1) DEFAULT 0,
  `indoor_outdoor` enum('indoor','outdoor','either') DEFAULT 'either',
  `intensity` enum('calm','neutral','activating') DEFAULT 'neutral',
  `crisis_safe` tinyint(1) DEFAULT 1,
  `is_guided` tinyint(1) DEFAULT 0,
  `min_age` smallint(5) UNSIGNED DEFAULT NULL,
  `max_age` smallint(5) UNSIGNED DEFAULT NULL,
  `suitability_notes` text DEFAULT NULL,
  `contraindication_notes` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `exercise_runs`
--

CREATE TABLE `exercise_runs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `exercise_id` bigint(20) UNSIGNED NOT NULL,
  `started_at` datetime DEFAULT current_timestamp(),
  `finished_at` datetime DEFAULT NULL,
  `tension_before` tinyint(3) UNSIGNED DEFAULT NULL,
  `tension_after` tinyint(3) UNSIGNED DEFAULT NULL,
  `energy_before` tinyint(3) UNSIGNED DEFAULT NULL,
  `energy_after` tinyint(3) UNSIGNED DEFAULT NULL,
  `note` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `exercise_tags`
--

CREATE TABLE `exercise_tags` (
  `exercise_id` bigint(20) UNSIGNED NOT NULL,
  `tag_id` bigint(20) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `routines`
--

CREATE TABLE `routines` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `title` varchar(200) NOT NULL,
  `description` text DEFAULT NULL,
  `recurrence_type` enum('daily','weekly','custom') DEFAULT 'weekly',
  `recurrence_rule` varchar(120) DEFAULT NULL,
  `target_per_week` tinyint(3) UNSIGNED DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `routine_logs`
--

CREATE TABLE `routine_logs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `routine_id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `done_at` datetime DEFAULT current_timestamp(),
  `mood_after` tinyint(3) UNSIGNED DEFAULT NULL,
  `energy_after` tinyint(3) UNSIGNED DEFAULT NULL,
  `note` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `skills`
--

CREATE TABLE `skills` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `category_id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(160) NOT NULL,
  `description` text DEFAULT NULL,
  `difficulty_level` tinyint(3) UNSIGNED DEFAULT 1,
  `energy_required` enum('low','medium','high') DEFAULT 'low',
  `time_investment_type` enum('micro','short','deep') DEFAULT 'micro',
  `evidence_level` enum('none','anecdotal','clinical_practice','evidence_based') DEFAULT 'none',
  `source_type` enum('CBT','DBT','habit_theory','mindfulness','somatic','custom','other') DEFAULT 'custom'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `states`
--

CREATE TABLE `states` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(120) NOT NULL,
  `description` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `state_exercise_map`
--

CREATE TABLE `state_exercise_map` (
  `state_id` bigint(20) UNSIGNED NOT NULL,
  `exercise_id` bigint(20) UNSIGNED NOT NULL,
  `priority` tinyint(3) UNSIGNED DEFAULT 3,
  `why_it_works` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `state_logs`
--

CREATE TABLE `state_logs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `state_id` bigint(20) UNSIGNED NOT NULL,
  `tension_level` tinyint(3) UNSIGNED NOT NULL,
  `energy_level` tinyint(3) UNSIGNED NOT NULL,
  `logged_at` datetime DEFAULT current_timestamp(),
  `note` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tags`
--

CREATE TABLE `tags` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(80) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tasks`
--

CREATE TABLE `tasks` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `title` varchar(200) NOT NULL,
  `description` text DEFAULT NULL,
  `status` enum('todo','doing','done','blocked','dropped') DEFAULT 'todo',
  `energy_required` enum('low','medium','high') DEFAULT 'medium',
  `estimated_minutes` smallint(5) UNSIGNED DEFAULT NULL,
  `due_at` datetime DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `completed_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `task_chunks`
--

CREATE TABLE `task_chunks` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `task_id` bigint(20) UNSIGNED NOT NULL,
  `title` varchar(200) NOT NULL,
  `notes` text DEFAULT NULL,
  `estimated_minutes` smallint(5) UNSIGNED DEFAULT NULL,
  `status` enum('todo','doing','done','blocked','dropped') DEFAULT 'todo',
  `sort_order` tinyint(3) UNSIGNED DEFAULT 0,
  `created_at` datetime DEFAULT current_timestamp(),
  `completed_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `display_name` varchar(120) NOT NULL,
  `handle` varchar(80) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `email` varchar(255) NOT NULL,
  `password_hash` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user_exercise_exclusions`
--

CREATE TABLE `user_exercise_exclusions` (
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `exercise_id` bigint(20) UNSIGNED NOT NULL,
  `excluded_at` datetime DEFAULT current_timestamp(),
  `reason` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user_exercise_feedback`
--

CREATE TABLE `user_exercise_feedback` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `exercise_id` bigint(20) UNSIGNED NOT NULL,
  `exercise_run_id` bigint(20) UNSIGNED DEFAULT NULL,
  `helped` tinyint(1) NOT NULL,
  `effectiveness_rating` tinyint(3) UNSIGNED DEFAULT NULL,
  `speed_of_effect` enum('instant','fast','medium','slow','unknown') DEFAULT 'unknown',
  `created_at` datetime DEFAULT current_timestamp(),
  `comment` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user_settings`
--

CREATE TABLE `user_settings` (
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `allow_gamification` tinyint(1) NOT NULL DEFAULT 1,
  `privacy_mode` tinyint(1) NOT NULL DEFAULT 0,
  `updated_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `user_tag_exclusions`
--

CREATE TABLE `user_tag_exclusions` (
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `tag_id` bigint(20) UNSIGNED NOT NULL,
  `excluded_at` datetime DEFAULT current_timestamp(),
  `reason` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_categories_name` (`name`);

--
-- Indexes for table `exercises`
--
ALTER TABLE `exercises`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_exercises_skill_name` (`skill_id`,`name`),
  ADD KEY `idx_exercises_skill` (`skill_id`);

--
-- Indexes for table `exercise_runs`
--
ALTER TABLE `exercise_runs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_exercise_runs_user_time` (`user_id`,`started_at`),
  ADD KEY `idx_exercise_runs_exercise_time` (`exercise_id`,`started_at`);

--
-- Indexes for table `exercise_tags`
--
ALTER TABLE `exercise_tags`
  ADD PRIMARY KEY (`exercise_id`,`tag_id`),
  ADD KEY `idx_exercise_tags_tag` (`tag_id`);

--
-- Indexes for table `routines`
--
ALTER TABLE `routines`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_routines_user_active` (`user_id`,`is_active`);

--
-- Indexes for table `routine_logs`
--
ALTER TABLE `routine_logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_routine_logs_user_time` (`user_id`,`done_at`),
  ADD KEY `idx_routine_logs_routine_time` (`routine_id`,`done_at`);

--
-- Indexes for table `skills`
--
ALTER TABLE `skills`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_skills_category_name` (`category_id`,`name`),
  ADD KEY `idx_skills_category` (`category_id`);

--
-- Indexes for table `states`
--
ALTER TABLE `states`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_states_name` (`name`);

--
-- Indexes for table `state_exercise_map`
--
ALTER TABLE `state_exercise_map`
  ADD PRIMARY KEY (`state_id`,`exercise_id`),
  ADD KEY `idx_state_ex_map_exercise` (`exercise_id`);

--
-- Indexes for table `state_logs`
--
ALTER TABLE `state_logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_state_logs_user_time` (`user_id`,`logged_at`),
  ADD KEY `idx_state_logs_state_time` (`state_id`,`logged_at`);

--
-- Indexes for table `tags`
--
ALTER TABLE `tags`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uq_tags_name` (`name`);

--
-- Indexes for table `tasks`
--
ALTER TABLE `tasks`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_tasks_user_status_due` (`user_id`,`status`,`due_at`);

--
-- Indexes for table `task_chunks`
--
ALTER TABLE `task_chunks`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_chunks_task_status` (`task_id`,`status`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `uq_users_email` (`email`),
  ADD UNIQUE KEY `uq_users_handle` (`handle`);

--
-- Indexes for table `user_exercise_exclusions`
--
ALTER TABLE `user_exercise_exclusions`
  ADD PRIMARY KEY (`user_id`,`exercise_id`),
  ADD KEY `idx_user_ex_exclusions_exercise` (`exercise_id`);

--
-- Indexes for table `user_exercise_feedback`
--
ALTER TABLE `user_exercise_feedback`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_feedback_user_exercise_time` (`user_id`,`exercise_id`,`created_at`),
  ADD KEY `idx_feedback_exercise_time` (`exercise_id`,`created_at`),
  ADD KEY `fk_feedback_run` (`exercise_run_id`);

--
-- Indexes for table `user_settings`
--
ALTER TABLE `user_settings`
  ADD PRIMARY KEY (`user_id`);

--
-- Indexes for table `user_tag_exclusions`
--
ALTER TABLE `user_tag_exclusions`
  ADD PRIMARY KEY (`user_id`,`tag_id`),
  ADD KEY `idx_user_tag_exclusions_tag` (`tag_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `exercises`
--
ALTER TABLE `exercises`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `exercise_runs`
--
ALTER TABLE `exercise_runs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `routines`
--
ALTER TABLE `routines`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `routine_logs`
--
ALTER TABLE `routine_logs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `skills`
--
ALTER TABLE `skills`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `states`
--
ALTER TABLE `states`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `state_logs`
--
ALTER TABLE `state_logs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tags`
--
ALTER TABLE `tags`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tasks`
--
ALTER TABLE `tasks`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `task_chunks`
--
ALTER TABLE `task_chunks`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `user_exercise_feedback`
--
ALTER TABLE `user_exercise_feedback`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `exercises`
--
ALTER TABLE `exercises`
  ADD CONSTRAINT `fk_exercises_skill` FOREIGN KEY (`skill_id`) REFERENCES `skills` (`id`);

--
-- Constraints for table `exercise_runs`
--
ALTER TABLE `exercise_runs`
  ADD CONSTRAINT `fk_exercise_runs_exercise` FOREIGN KEY (`exercise_id`) REFERENCES `exercises` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_exercise_runs_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `exercise_tags`
--
ALTER TABLE `exercise_tags`
  ADD CONSTRAINT `fk_exercise_tags_exercise` FOREIGN KEY (`exercise_id`) REFERENCES `exercises` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_exercise_tags_tag` FOREIGN KEY (`tag_id`) REFERENCES `tags` (`id`);

--
-- Constraints for table `routines`
--
ALTER TABLE `routines`
  ADD CONSTRAINT `fk_routines_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `routine_logs`
--
ALTER TABLE `routine_logs`
  ADD CONSTRAINT `fk_routine_logs_routine` FOREIGN KEY (`routine_id`) REFERENCES `routines` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_routine_logs_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `skills`
--
ALTER TABLE `skills`
  ADD CONSTRAINT `fk_skills_category` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`);

--
-- Constraints for table `state_exercise_map`
--
ALTER TABLE `state_exercise_map`
  ADD CONSTRAINT `fk_state_ex_map_exercise` FOREIGN KEY (`exercise_id`) REFERENCES `exercises` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_state_ex_map_state` FOREIGN KEY (`state_id`) REFERENCES `states` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `state_logs`
--
ALTER TABLE `state_logs`
  ADD CONSTRAINT `fk_state_logs_state` FOREIGN KEY (`state_id`) REFERENCES `states` (`id`),
  ADD CONSTRAINT `fk_state_logs_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `tasks`
--
ALTER TABLE `tasks`
  ADD CONSTRAINT `fk_tasks_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `task_chunks`
--
ALTER TABLE `task_chunks`
  ADD CONSTRAINT `fk_task_chunks_task` FOREIGN KEY (`task_id`) REFERENCES `tasks` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `user_exercise_exclusions`
--
ALTER TABLE `user_exercise_exclusions`
  ADD CONSTRAINT `fk_user_ex_exclusions_exercise` FOREIGN KEY (`exercise_id`) REFERENCES `exercises` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_user_ex_exclusions_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `user_exercise_feedback`
--
ALTER TABLE `user_exercise_feedback`
  ADD CONSTRAINT `fk_feedback_exercise` FOREIGN KEY (`exercise_id`) REFERENCES `exercises` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_feedback_run` FOREIGN KEY (`exercise_run_id`) REFERENCES `exercise_runs` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_feedback_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `user_settings`
--
ALTER TABLE `user_settings`
  ADD CONSTRAINT `fk_user_settings_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `user_tag_exclusions`
--
ALTER TABLE `user_tag_exclusions`
  ADD CONSTRAINT `fk_user_tag_exclusions_tag` FOREIGN KEY (`tag_id`) REFERENCES `tags` (`id`),
  ADD CONSTRAINT `fk_user_tag_exclusions_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
