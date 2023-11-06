// Copyright 2013-2023 Daniel Parker
// Distributed under the Boost license, Version 1.0.
// (See accompanying file LICENSE_1_0.txt or copy at http://www.boost.org/LICENSE_1_0.txt)

// See https://github.com/danielaparker/jsoncons for latest version

#ifndef JSONCONS_JSON_TYPE_HPP
#define JSONCONS_JSON_TYPE_HPP

#include <ostream>
#include <jsoncons/config/jsoncons_config.hpp>

namespace jsoncons {

    enum class json_type : uint8_t 
    {
        null_value,
        bool_value,
        int64_value,
        uint64_value,
        half_value,
        double_value,
        string_value,
        byte_string_value,
        array_value,
        object_value
    };

    template <class CharT>
    std::basic_ostream<CharT>& operator<<(std::basic_ostream<CharT>& os, json_type type)
    {
        static constexpr const CharT* null_value = JSONCONS_CSTRING_CONSTANT(CharT, "null");
        static constexpr const CharT* bool_value = JSONCONS_CSTRING_CONSTANT(CharT, "bool");
        static constexpr const CharT* int64_value = JSONCONS_CSTRING_CONSTANT(CharT, "int64");
        static constexpr const CharT* uint64_value = JSONCONS_CSTRING_CONSTANT(CharT, "uint64");
        static constexpr const CharT* half_value = JSONCONS_CSTRING_CONSTANT(CharT, "half");
        static constexpr const CharT* double_value = JSONCONS_CSTRING_CONSTANT(CharT, "double");
        static constexpr const CharT* string_value = JSONCONS_CSTRING_CONSTANT(CharT, "string");
        static constexpr const CharT* byte_string_value = JSONCONS_CSTRING_CONSTANT(CharT, "byte_string");
        static constexpr const CharT* array_value = JSONCONS_CSTRING_CONSTANT(CharT, "array");
        static constexpr const CharT* object_value = JSONCONS_CSTRING_CONSTANT(CharT, "object");

        switch (type)
        {
            case json_type::null_value:
            {
                os << null_value;
                break;
            }
            case json_type::bool_value:
            {
                os << bool_value;
                break;
            }
            case json_type::int64_value:
            {
                os << int64_value;
                break;
            }
            case json_type::uint64_value:
            {
                os << uint64_value;
                break;
            }
            case json_type::half_value:
            {
                os << half_value;
                break;
            }
            case json_type::double_value:
            {
                os << double_value;
                break;
            }
            case json_type::string_value:
            {
                os << string_value;
                break;
            }
            case json_type::byte_string_value:
            {
                os << byte_string_value;
                break;
            }
            case json_type::array_value:
            {
                os << array_value;
                break;
            }
            case json_type::object_value:
            {
                os << object_value;
                break;
            }
        }
        return os;
    }

    enum class json_storage_kind : uint8_t 
    {
        null_value = 0x00,
        bool_value = 0x01,
        int64_value = 0x02,
        uint64_value = 0x03,
        half_value = 0x04,
        double_value = 0x05,
        short_string_value = 0x06,
        long_string_value = 0x07,
        byte_string_value = 0x08,
        array_value = 0x09,
        empty_object_value = 0x0a,
        object_value = 0x0b,
        json_const_pointer = 0x0c
    };

    template <class CharT>
    std::basic_ostream<CharT>& operator<<(std::basic_ostream<CharT>& os, json_storage_kind storage)
    {
        static constexpr const CharT* null_value = JSONCONS_CSTRING_CONSTANT(CharT, "null");
        static constexpr const CharT* bool_value = JSONCONS_CSTRING_CONSTANT(CharT, "bool");
        static constexpr const CharT* int64_value = JSONCONS_CSTRING_CONSTANT(CharT, "int64");
        static constexpr const CharT* uint64_value = JSONCONS_CSTRING_CONSTANT(CharT, "uint64");
        static constexpr const CharT* half_value = JSONCONS_CSTRING_CONSTANT(CharT, "half");
        static constexpr const CharT* double_value = JSONCONS_CSTRING_CONSTANT(CharT, "double");
        static constexpr const CharT* short_string_value = JSONCONS_CSTRING_CONSTANT(CharT, "short_string");
        static constexpr const CharT* long_string_value = JSONCONS_CSTRING_CONSTANT(CharT, "string");
        static constexpr const CharT* byte_string_value = JSONCONS_CSTRING_CONSTANT(CharT, "byte_string");
        static constexpr const CharT* array_value = JSONCONS_CSTRING_CONSTANT(CharT, "array");
        static constexpr const CharT* empty_object_value = JSONCONS_CSTRING_CONSTANT(CharT, "empty_object");
        static constexpr const CharT* object_value = JSONCONS_CSTRING_CONSTANT(CharT, "object");
        static constexpr const CharT* json_const_pointer = JSONCONS_CSTRING_CONSTANT(CharT, "json_const_pointer");

        switch (storage)
        {
            case json_storage_kind::null_value:
            {
                os << null_value;
                break;
            }
            case json_storage_kind::bool_value:
            {
                os << bool_value;
                break;
            }
            case json_storage_kind::int64_value:
            {
                os << int64_value;
                break;
            }
            case json_storage_kind::uint64_value:
            {
                os << uint64_value;
                break;
            }
            case json_storage_kind::half_value:
            {
                os << half_value;
                break;
            }
            case json_storage_kind::double_value:
            {
                os << double_value;
                break;
            }
            case json_storage_kind::short_string_value:
            {
                os << short_string_value;
                break;
            }
            case json_storage_kind::long_string_value:
            {
                os << long_string_value;
                break;
            }
            case json_storage_kind::byte_string_value:
            {
                os << byte_string_value;
                break;
            }
            case json_storage_kind::array_value:
            {
                os << array_value;
                break;
            }
            case json_storage_kind::empty_object_value:
            {
                os << empty_object_value;
                break;
            }
            case json_storage_kind::object_value:
            {
                os << object_value;
                break;
            }
            case json_storage_kind::json_const_pointer:
            {
                os << json_const_pointer;
                break;
            }
        }
        return os;
    }

} // jsoncons

#endif
