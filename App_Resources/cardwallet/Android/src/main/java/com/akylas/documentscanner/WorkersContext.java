package com.akylas.documentscanner;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

public final class WorkersContext {
    private final static Map<String, Object> container = new ConcurrentHashMap<String, Object>();

    public static Object getValue(String key) {
        return container.get(key);
    }

    public static void setValue(String key, Object value) {
        if (value != null) {
            container.put(key, value);
        } else {
            container.remove(key);
        }
    }
}