package com.akylas.documentscanner

import java.util.concurrent.ConcurrentHashMap

object WorkersContext {
    private val container: MutableMap<String, Any> = ConcurrentHashMap()
    fun getValue(key: String): Any? {
        return container[key]
    }

    fun setValue(key: String, value: Any?) {
        if (value != null) {
            container[key] = value
        } else {
            container.remove(key)
        }
    }
}