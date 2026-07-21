CREATE TABLE `memo` (
  `id` INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  `uid` TEXT NOT NULL,
  `creator_id` INTEGER NOT NULL,
  `created_ts` INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
  `updated_ts` INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
  `row_status` TEXT NOT NULL DEFAULT 'NORMAL',
  `content` TEXT NOT NULL,
  `visibility` TEXT NOT NULL DEFAULT 'PRIVATE',
  `pinned` BOOLEAN NOT NULL DEFAULT 0,
  `payload` TEXT NOT NULL DEFAULT '{}',
  `parent_uid` TEXT,
  UNIQUE KEY `uq_uid` (`uid`),
  KEY `idx_creator_id` (`creator_id`),
  KEY `idx_created_ts` (`created_ts`),
  KEY `idx_updated_ts` (`updated_ts`),
  KEY `idx_row_status` (`row_status`),
  KEY `idx_visibility` (`visibility`),
  KEY `idx_parent_uid` (`parent_uid`)
);

CREATE TABLE `memo_relation` (
  `id` INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
  `memo_id` INTEGER NOT NULL,
  `related_memo_id` INTEGER NOT NULL,
  `type` TEXT NOT NULL,
  `created_ts` INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
  UNIQUE KEY `uq_memo_relation` (`memo_id`, `related_memo_id`, `type`),
  KEY `idx_memo_id` (`memo_id`),
  KEY `idx_related_memo_id` (`related_memo_id`),
  CONSTRAINT `fk_memo_relation_memo` FOREIGN KEY (`memo_id`) REFERENCES `memo` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_memo_relation_related_memo` FOREIGN KEY (`related_memo_id`) REFERENCES `memo` (`id`) ON DELETE CASCADE
);
