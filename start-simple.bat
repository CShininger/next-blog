@echo off
echo 启动博客系统（使用现有镜像）...
echo.

echo 1. 检查Docker是否运行...
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Docker未安装或未运行
    pause
    exit /b 1
)

echo.
echo 2. 创建必要的目录...
if not exist "md-svc\uploads" mkdir "md-svc\uploads"
if not exist "md-svc\logs" mkdir "md-svc\logs"

echo.
echo 3. 停止可能运行的旧容器...
docker-compose down

echo.
echo 4. 启动所有服务（不构建）...
docker-compose up -d
if %errorlevel% neq 0 (
    echo ERROR: 服务启动失败
    echo 请检查镜像是否存在：
    echo - next-blog:latest
    echo - md-svc:latest
    echo - mongo:latest
    echo.
    echo 查看错误信息：
    docker-compose logs
    pause
    exit /b 1
)

echo.
echo 5. 等待服务启动...
timeout /t 10 /nobreak > nul

echo.
echo 6. 检查服务状态...
docker-compose ps

echo.
echo 博客系统已启动！
echo 前端地址: http://localhost:3000
echo 后端地址: http://localhost:3001
echo 数据库地址: mongodb://root:root@localhost:27017/markdown_db
echo.
echo 常用命令:
echo - 查看日志: docker-compose logs -f
echo - 停止服务: docker-compose down
echo - 重启服务: docker-compose restart
echo.
pause 