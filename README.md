# HTTP Request Tool

一个简单的HTTP请求工具，基于TypeScript和Vite构建。

## 功能特性

- 🌐 支持多种HTTP方法：GET、POST、PUT、DELETE、PATCH
- 📝 自定义请求头管理
- 📦 JSON请求体支持
- 📊 详细的响应信息显示
- 🎨 现代化的Bootstrap界面
- 📱 响应式设计，支持移动端
- ⚡ 实时请求状态反馈

## 快速开始

### 启动开发服务器
```bash
npm install
npm run dev
```

### 构建生产版本
```bash
npm run build
```

## 使用方法

1. **输入请求地址**：在URL输入框中填写完整的HTTP地址
2. **选择请求方法**：从下拉菜单中选择GET、POST、PUT、DELETE或PATCH
3. **添加请求头**：点击"添加请求头"按钮添加自定义请求头
4. **填写请求体**：对于POST、PUT、PATCH请求，可以在请求体文本框中填写JSON数据
5. **发送请求**：点击"发送请求"按钮发起HTTP请求
6. **查看响应**：在响应结果区域查看状态码、响应头和响应体

## 示例

### GET请求
```
URL: https://jsonplaceholder.typicode.com/posts/1
Method: GET
```

### POST请求
```
URL: https://jsonplaceholder.typicode.com/posts
Method: POST
Headers: Content-Type: application/json
Body: {"title": "Test Post", "body": "This is a test", "userId": 1}
```

## 技术栈

- **前端框架**: TypeScript + Vite
- **UI库**: Bootstrap 5
- **HTTP客户端**: Fetch API
- **样式**: SCSS
- **构建工具**: Vite

## 项目结构

```
src/
├── index.ts          # 主要逻辑代码
├── index.scss        # 样式文件
└── locales/          # 国际化文件（可选）
    ├── zh.ts         # 中文配置
    ├── en.ts         # 英文配置
    └── i18n.ts       # 国际化初始化
```

## 开发指南

### 添加新功能
1. 在 `src/index.ts` 中添加新的功能逻辑
2. 在 `src/index.scss` 中添加相应的样式
3. 在 `index.html` 中添加必要的HTML元素

### 自定义样式
项目使用SCSS进行样式管理，主要样式文件位于 `src/index.scss`。

### 国际化支持
项目支持国际化，可以通过修改 `src/locales/` 目录下的文件来添加新的语言支持。

## 许可证

ISC License
