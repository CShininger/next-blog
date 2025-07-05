@echo off
echo 开始诊断Docker构建问题...
echo.

echo 1. 检查Docker是否运行...
docker --version
if %errorlevel% neq 0 (
    echo ERROR: Docker未安装或未运行
    pause
    exit /b 1
)

echo.
echo 2. 检查必要文件是否存在...
if not exist "next-blog\Dockerfile" (
    echo ERROR: next-blog\Dockerfile 不存在
    pause
    exit /b 1
)
if not exist "md-svc\Dockerfile" (
    echo ERROR: md-svc\Dockerfile 不存在
    pause
    exit /b 1
)
if not exist "md-svc\mongo-init.js" (
    echo ERROR: md-svc\mongo-init.js 不存在
    pause
    exit /b 1
)

echo.
echo 3. 检查目录结构...
dir next-blog
echo.
dir md-svc

echo.
echo 4. 尝试单独构建后端服务...
docker build -t test-backend ./md-svc
if %errorlevel% neq 0 (
    echo ERROR: 后端服务构建失败
    pause
    exit /b 1
)

echo.
echo 5. 尝试单独构建前端服务...
docker build -t test-frontend ./next-blog
if %errorlevel% neq 0 (
    echo ERROR: 前端服务构建失败
    pause
    exit /b 1
)

echo.
echo 6. 清理测试镜像...
docker rmi test-backend test-frontend

echo.
echo 诊断完成！所有构建都成功。
echo 现在可以尝试运行: docker-compose up --build -d
echo.
pause 