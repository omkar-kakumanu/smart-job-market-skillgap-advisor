@REM ----------------------------------------------------------------------------
@REM Licensed to the Apache Software Foundation (ASF) under one
@REM or more contributor license agreements.  See the NOTICE file
@REM distributed with this work for additional information
@REM regarding copyright ownership.  The ASF licenses this file
@REM to You under the Apache License, Version 2.0 (the
@REM "License"); you may not use this file except in compliance
@REM with the License.  You may obtain a copy of the License at
@REM
@REM    https://www.apache.org/licenses/LICENSE-2.0
@REM
@REM Unless required by applicable law or agreed to in writing,
@REM software distributed under the License is distributed on an
@REM "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
@REM KIND, either express or implied.  See the License for the
@REM specific language governing permissions and limitations
@REM under the License.
@REM ----------------------------------------------------------------------------

@REM ----------------------------------------------------------------------------
@REM Maven Start Up Batch script
@REM ----------------------------------------------------------------------------

@IF "%DEBUG%" == "" @ECHO off
@REM set %%~dp0 arg to variable %EXEC_DIR%
SET EXEC_DIR=%~dp0

@REM Disable echo of command lines for each file processed
@ECHO OFF

@REM enable echoing of execution commands
@IF "%MVNW_VERBOSE%" == "true" @ECHO ON

SET MAVEN_PROJECTBASEDIR=%EXEC_DIR%
@IF NOT "%MAVEN_PROJECTBASEDIR%"=="" SET MAVEN_PROJECTBASEDIR=%MAVEN_PROJECTBASEDIR:~0,-1%

@REM Execute Maven Wrapper script
@REM ----------------------------------------------------------------------------
IF EXIST "%MAVEN_PROJECTBASEDIR%\.mvn\wrapper\maven-wrapper.jar" (
    GOTO wrapper
)

:download
ECHO Downloading Maven Wrapper...
SET DOWNLOAD_URL="https://repo.maven.apache.org/maven2/org/apache/maven/wrapper/maven-wrapper/3.2.0/maven-wrapper-3.2.0.jar"
powershell -Command "[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; (New-Object Net.WebClient).DownloadFile(%DOWNLOAD_URL%, '%MAVEN_PROJECTBASEDIR%\.mvn\wrapper\maven-wrapper.jar')"

:wrapper
SET WRAPPER_JAR="%MAVEN_PROJECTBASEDIR%\.mvn\wrapper\maven-wrapper.jar"
SET WRAPPER_LAUNCHER=org.apache.maven.wrapper.MavenWrapperMain

IF NOT EXIST "%MAVEN_PROJECTBASEDIR%\.mvn\wrapper\maven-wrapper.properties" (
    powershell -Command "[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12; (New-Object Net.WebClient).DownloadFile('https://raw.githubusercontent.com/takari/maven-wrapper/master/mvnw/maven-wrapper.properties', '%MAVEN_PROJECTBASEDIR%\.mvn\wrapper\maven-wrapper.properties')"
)

SET JAVACMD=java
IF DEFINED JAVA_HOME (
    IF EXIST "%JAVA_HOME%\bin\java.exe" SET JAVACMD="%JAVA_HOME%\bin\java"
)

%JAVACMD% -cp %WRAPPER_JAR% "-Dmaven.multiModuleProjectDirectory=%MAVEN_PROJECTBASEDIR%" "-Dmaven.home=%MAVEN_PROJECTBASEDIR%\.mvn\wrapper" %WRAPPER_LAUNCHER% %*
IF ERRORLEVEL 1 GOTO fail

GOTO end

:fail
exit /b 1

:end
exit /b 0
