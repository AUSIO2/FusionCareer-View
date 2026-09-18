# 管理员用户管理接口约定

任务 2 的前端页面仅向 `SUPER_ADMIN` 展示系统管理入口。后端仍需在每个 `/admin/user/**` 接口校验超级管理员权限，不能只依赖前端隐藏。

所有 JSON 接口沿用项目统一响应结构：`{ "code": 200, "message": "success", "data": ... }`。

## 用户与角色

- `GET /admin/user/list?page=1&size=20&username=&role=`：分页查询用户。
- `PUT /admin/user/{userId}/role?role=NORMAL|ADMIN|SUPER_ADMIN`：修改角色。

当前登录账号不能修改自己的角色，避免误操作导致自己立即失去权限。其他 `SUPER_ADMIN` 可以由超级管理员降级，升降超级管理员时前端会二次确认。后端必须拒绝降级系统中的最后一名超级管理员，确保始终至少保留一个最高权限账号。

分页数据使用 `{ list, total, totalPages }`。列表项至少包含 `id`、`username`、`studentId`、`role`、`createdAt`。

## 用户详情

以下资料和简历接口只用于 `NORMAL` 普通用户。`ADMIN` 与 `SUPER_ADMIN` 是管理账号，前端不展示学生资料、简历正文或简历文件入口。

- `GET /admin/user/{userId}/profile`：查询个人资料，字段与 `/user/profile/get` 相同。
- `GET /admin/user/{userId}/resume`：查询简历正文，字段与 `/user/resume/get` 相同。
- `GET /admin/user/{userId}/resume/file/list`：查询简历文件，字段与 `/user/resume/file/list` 相同。
- `GET /admin/user/{userId}/resume/file/{fileId}/download`：下载指定简历文件。

## 表格导出

- `GET /admin/user/export?format=xlsx`：导出全部用户资料和简历正文，响应为 Excel 二进制文件。

导出内容需至少包含用户身份、角色、个人资料全部字段和简历正文全部字段；不在表格中内嵌简历文件。
