import {
  pgTable,
  pgEnum,
  serial,
  varchar,
  text,
  integer,
  numeric,
  boolean,
  timestamp,
  jsonb,
} from 'drizzle-orm/pg-core';

export const metricTypeEnum = pgEnum('metric_type', [
  'startup',
  'switching',
  'frame_rate',
  'static_memory',
  'peak_memory',
]);

export const reportStatusEnum = pgEnum('report_status', ['draft', 'sent']);

export const taskStatusEnum = pgEnum('task_status', [
  'active',
  'paused',
  'completed',
]);

export const metricRecords = pgTable('metric_records', {
  id: serial('id').primaryKey(),
  metricType: metricTypeEnum('metric_type').notNull(),
  testDate: timestamp('test_date').notNull(),
  platform: varchar('platform', { length: 100 }).notNull(),
  product: varchar('product', { length: 100 }).notNull(),
  version: varchar('version', { length: 100 }).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const metricValues = pgTable('metric_values', {
  id: serial('id').primaryKey(),
  recordId: integer('record_id')
    .notNull()
    .references(() => metricRecords.id),
  sceneName: varchar('scene_name', { length: 200 }).notNull(),
  metricName: varchar('metric_name', { length: 200 }).notNull(),
  value: numeric('value', { precision: 10, scale: 2 }).notNull(),
  unit: varchar('unit', { length: 20 }).notNull(),
  baseline: numeric('baseline', { precision: 10, scale: 2 }),
  threshold: numeric('threshold', { precision: 10, scale: 2 }),
});

export const highlightRules = pgTable('highlight_rules', {
  id: serial('id').primaryKey(),
  metricType: metricTypeEnum('metric_type').notNull(),
  ruleName: varchar('rule_name', { length: 200 }).notNull(),
  condition: varchar('condition', { length: 500 }).notNull(),
  color: varchar('color', { length: 20 }).default('#ef4444'),
  isActive: boolean('is_active').default(true),
});

export const reports = pgTable('reports', {
  id: serial('id').primaryKey(),
  subject: varchar('subject', { length: 500 }),
  ccList: text('cc_list'),
  versionInfo: text('version_info'),
  topIssues: text('top_issues'),
  selectedMetrics: jsonb('selected_metrics'),
  contentHtml: text('content_html'),
  status: reportStatusEnum('status').default('draft'),
  sentAt: timestamp('sent_at'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const taskSchedules = pgTable('task_schedules', {
  id: serial('id').primaryKey(),
  taskName: varchar('task_name', { length: 200 }).notNull(),
  cronExpr: varchar('cron_expr', { length: 100 }).notNull(),
  taskType: varchar('task_type', { length: 100 }).notNull(),
  status: taskStatusEnum('status').default('active'),
  lastRun: timestamp('last_run'),
  nextRun: timestamp('next_run'),
  createdAt: timestamp('created_at').defaultNow(),
});
