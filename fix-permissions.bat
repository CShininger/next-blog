@echo off
echo 修复Docker构建权限和目录问题...
echo.

echo 1. 创建必要的目录...
if not exist "md-svc\uploads" mkdir "md-svc\uploads"
if not exist "md-svc\logs" mkdir "md-svc\logs"

echo.
echo 2. 检查MongoDB数据目录...
if not exist "D:\docker volumns\mongo" (
    echo 创建MongoDB数据目录...
    mkdir "D:\docker volumns\mongo" 2>nul
    if %errorlevel% neq 0 (
        echo 警告: 无法创建MongoDB数据目录，请手动创建或修改docker-compose.yml中的路径
    )
)

echo.
echo 3. 清理旧的Docker资源...
docker system prune -f

echo.
echo 4. 删除可能冲突的镜像...
docker rmi blog-backend blog-frontend 2>nul

echo.
echo 权限修复完成！
echo 现在可以尝试运行: start.bat
echo.
pause 