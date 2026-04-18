# Camera UI - SOC度量平台

SOC Camera度量与任务调度管理平台，基于 Next.js 16 + PostgreSQL + Tailwind CSS + Drizzle ORM 构建。

## 功能模块

### SOC度量
- **Camera度量**
  - 启动专项 - Camera冷/热启动时间度量
  - 切换专项 - 前后置切换及模式切换时间度量
  - 帧率帧间隔 - 预览和拍摄帧率度量
  - 静态内存 - Camera进程静态内存占用度量
  - 峰值内存 - 拍照和录像峰值内存度量
  - 报告发送 - 编辑并发送度量报告邮件
- **任务调度** - 自动化测试任务管理

### 数据展示
- 每个度量页面包含**趋势图**和**数据表**
- 数据表支持**标红突出显示**（基于可配置规则）
- 支持按阈值、基线倍数等条件进行数据高亮

### 报告发送
- 邮件抄送人管理
- 邮件主题与版本信息编辑
- Top问题填写
- 引入Camera度量数据（图+表）
- 可视化报告预览
- 一键邮件发送

## 技术栈

| 技术 | 用途 |
|------|------|
| Next.js 16+ | 全栈框架（App Router） |
| TypeScript | 类型安全 |
| Tailwind CSS v4 | 样式 |
| PostgreSQL | 数据库 |
| Drizzle ORM | 数据库ORM |
| Recharts | 图表可视化 |
| @tanstack/react-table | 数据表格 |
| Zustand | 状态管理 |
| Zod | 数据校验 |
| Nodemailer | 邮件发送 |
| @dnd-kit | 拖拽排序 |
| lucide-react | 图标 |

## 快速开始

### 环境要求
- Node.js 18+
- PostgreSQL 14+

### 安装

```bash
npm install
```

### 环境变量

创建 `.env.local` 文件：

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/camera_ui
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@example.com
SMTP_PASS=your-password
SMTP_FROM=noreply@example.com
```

### 数据库迁移

```bash
npx drizzle-kit generate
npx drizzle-kit migrate
```

### 开发

```bash
npm run dev
```

访问 http://localhost:3000

### 构建

```bash
npm run build
npm start
```

## 项目结构

```
src/
├── app/                    # Next.js App Router 路由
│   ├── api/               # API 路由
│   │   ├── metrics/       # 度量数据 API
│   │   ├── report/        # 报告 API
│   │   ├── highlight-rules/ # 高亮规则 API
│   │   └── task-schedules/  # 任务调度 API
│   └── soc-metrics/       # 页面路由
│       ├── camera/        # Camera度量页面
│       └── task-scheduler/ # 任务调度页面
├── components/            # React 组件
│   ├── layout/           # 布局组件
│   ├── metrics/          # 度量展示组件
│   └── report/           # 报告相关组件
├── db/                    # 数据库层
│   ├── schema.ts         # Drizzle Schema
│   └── index.ts          # 数据库连接
├── lib/                   # 工具库
│   ├── highlight-rules.ts # 数据高亮规则引擎
│   ├── email.ts          # 邮件发送
│   ├── seed-data.ts      # 种子/模拟数据
│   └── utils.ts          # 通用工具
└── stores/               # Zustand 状态管理
    └── report-store.ts   # 报告编辑状态
```