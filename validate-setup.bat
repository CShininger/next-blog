@echo off
echo 验证Docker Compose设置...
echo.

echo 1. 检查Docker环境...
docker --version
if %errorlevel% neq 0 (
    echo ERROR: Docker未安装或未运行
    echo 请先安装并启动Docker Desktop
    pause
    exit /b 1
)

echo.
echo 2. 检查Docker Compose...
docker-compose --version
if %errorlevel% neq 0 (
    echo ERROR: Docker Compose未安装
    pause
    exit /b 1
)

echo.
echo 3. 验证项目文件结构...
if not exist "docker-compose.yml" (
    echo ERROR: docker-compose.yml 不存在
    pause
    exit /b 1
)

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
echo 4. 创建必要目录...
if not exist "md-svc\uploads" (
    mkdir "md-svc\uploads"
    echo 创建了 md-svc\uploads 目录
)

if not exist "md-svc\logs" (
    mkdir "md-svc\logs"
    echo 创建了 md-svc\logs 目录
)

echo.
echo 5. 检查端口可用性...
netstat -ano | findstr :3000 >nul
if %errorlevel% equ 0 (
    echo 警告: 端口 3000 已被占用
    netstat -ano | findstr :3000
)

netstat -ano | findstr :3001 >nul
if %errorlevel% equ 0 (
    echo 警告: 端口 3001 已被占用
    netstat -ano | findstr :3001
)

netstat -ano | findstr :27017 >nul
if %errorlevel% equ 0 (
    echo 警告: 端口 27017 已被占用
    netstat -ano | findstr :27017
)

echo.
echo 6. 验证Docker Compose配置...
docker-compose config
if %errorlevel% neq 0 (
    echo ERROR: Docker Compose配置无效
    pause
    exit /b 1
)

echo.
echo 7. 测试网络连接...
ping -n 1 localhost >nul
if %errorlevel% neq 0 (
    echo ERROR: 无法连接到localhost
    pause
    exit /b 1
)

echo.
echo ========================================
echo 验证完成！
echo.
echo 你的环境已准备就绪，可以运行：
echo 1. start.bat        - 启动所有服务
echo 2. test-build.bat   - 测试构建过程
echo 3. fix-permissions.bat - 修复权限问题
echo.
echo 如果遇到问题，请查看 TROUBLESHOOTING.md
echo ========================================
echo.
pause 