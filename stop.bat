@echo off
echo 正在停止博客系统...
echo.

echo 1. 停止所有服务...
docker-compose down

echo.
echo 2. 清理未使用的镜像和容器...
docker system prune -f

echo.
echo 博客系统已停止！
echo.
pause 