# Solución de Problemas - Portal del Empleador

## Error: "Cannot find module '@angular/material/...'"

### Causa
Este error ocurre cuando el caché del servidor de desarrollo de Angular se corrompe o cuando `npm start` se ejecuta con el caché deshabilitado.

### Solución Rápida

**Opción 1: Limpiar caché y construir**
```bash
rm -rf .angular dist
npm run build
```

**Opción 2: Si el build funciona pero start no**
```bash
# Detener cualquier proceso ng serve en ejecución
pkill -f "ng serve"

# Limpiar solo el caché de Angular
rm -rf .angular

# Construir primero para generar el caché
npm run build

# Ahora iniciar el servidor de desarrollo
npm start
```

### Verificación

Para verificar que las dependencias están correctamente instaladas:

```bash
# Verificar que Angular Material está instalado
ls node_modules/@angular/material/

# Verificar que los módulos fesm2022 existen
ls node_modules/@angular/material/fesm2022/

# Debe mostrar archivos como: button.mjs, card.mjs, dialog.mjs, etc.
```

## Estado de las Dependencias

Las siguientes dependencias DEBEN estar instaladas:

```json
{
  "@angular/animations": "^20.0.0",
  "@angular/cdk": "^20.2.9",
  "@angular/common": "^20.0.0",
  "@angular/compiler": "^20.0.0",
  "@angular/core": "^20.0.0",
  "@angular/forms": "^20.0.0",
  "@angular/material": "^20.2.9",
  "@angular/platform-browser": "^20.0.0",
  "@angular/router": "^20.0.0"
}
```

## Configuración de Caché

El archivo `angular.json` está configurado para habilitar el caché:

```json
{
  "cli": {
    "analytics": false,
    "cache": {
      "enabled": true,
      "path": ".angular/cache",
      "environment": "all"
    }
  }
}
```

## Scripts Disponibles

```bash
npm run build    # Construir para producción (siempre funciona)
npm start        # Servidor de desarrollo con polling
npm run serve    # Servidor accesible externamente
```

## Proceso de Desarrollo Recomendado

1. **Primera vez:**
   ```bash
   npm install
   npm run build    # Genera el caché inicial
   npm start        # Inicia el servidor
   ```

2. **Desarrollo normal:**
   ```bash
   npm start
   ```

3. **Si aparecen errores de módulos:**
   ```bash
   rm -rf .angular
   npm run build
   npm start
   ```

## Build vs Serve

### Build (npm run build)
- ✅ Siempre funciona
- ✅ Genera archivos optimizados en `dist/`
- ✅ Crea el caché de compilación
- ⏱️ Toma 15-20 segundos
- 📦 Output: `dist/demo/browser/`

### Serve (npm start)
- 🔄 Modo de desarrollo con hot-reload
- 🚀 Más rápido después del primer build
- 👁️ Watch mode habilitado
- 🌐 Disponible en http://localhost:4200

## Comandos de Diagnóstico

```bash
# Ver versión de Angular CLI
npx ng version

# Verificar configuración de caché
cat angular.json | grep -A 5 cache

# Limpiar todo y empezar de nuevo
rm -rf node_modules .angular dist package-lock.json
npm install
npm run build
```

## Errores Comunes y Soluciones

### Error: "Prebundling has been configured but will not be used because caching has been disabled"

**Solución:**
```bash
rm -rf .angular
npm run build
```

### Error: "ECONNRESET" durante npm install

**Solución:**
```bash
# Usar instalación offline
npm install --prefer-offline --no-audit

# O reinstalar dependencias críticas
npm install @angular/material@^20.2.9 @angular/cdk@^20.2.9
```

### Error: "TS-992003: No suitable injection token"

Este error indica que Angular Material no se está resolviendo correctamente. **Solución:**

```bash
# Limpiar completamente
rm -rf .angular dist

# Reconstruir
npm run build
```

## Notas Importantes

1. **Siempre haz `npm run build` primero** si encuentras errores de módulos no encontrados
2. El archivo `.npmrc` está configurado para usar el caché local cuando sea posible
3. El caché de Angular se guarda en `.angular/cache/`
4. Los errores de "Cannot find module" son casi siempre problemas de caché, no de instalación

## Soporte

Si los problemas persisten después de seguir estos pasos:

1. Verifica que `node_modules/@angular/material/` existe y contiene archivos
2. Verifica que `.angular/cache/` se crea después de `npm run build`
3. Verifica la versión de Node: `node --version` (debe ser >= 18.19.0)
4. Verifica la versión de npm: `npm --version` (debe ser >= 10.0.0)

---

**Última actualización:** 2025-10-16
