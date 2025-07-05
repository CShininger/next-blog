@echo off
echo 正在启动博客系统...
echo.

echo 1. 检查Docker是否运行...
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Docker未安装或未运行，请先启动Docker Desktop
    pause
    exit /b 1
)

echo.
echo 2. 检查必要文件...
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

echo.
echo 3. 创建必要的目录...
if not exist "md-svc\uploads" mkdir "md-svc\uploads"
if not exist "md-svc\logs" mkdir "md-svc\logs"

echo.
echo 4. 停止可能运行的旧容器...
docker-compose down

echo.
echo 5. 构建并启动所有服务...
docker-compose up --build -d
if %errorlevel% neq 0 (
    echo ERROR: 服务启动失败，查看错误信息：
    docker-compose logs
    pause
    exit /b 1
)

echo.
echo 6. 等待服务启动...
timeout /t 15 /nobreak > nul

echo.
echo 7. 检查服务状态...
docker-compose ps

echo.
echo 博客系统已启动！
echo 前端地址: http://localhost:3000
echo 后端地址: http://localhost:3001
echo 数据库地址: mongodb://root:root@localhost:27017/markdown_db
echo.
echo 常用命令:
echo - 查看所有日志: docker-compose logs -f
echo - 查看特定服务日志: docker-compose logs -f [frontend/backend/mongodb]
echo - 停止服务: docker-compose down
echo - 重启服务: docker-compose restart
echo.
pause 