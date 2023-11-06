// Copyright 2013-2023 Daniel Parker
// Distributed under the Boost license, Version 1.0.
// (See accompanying file LICENSE_1_0.txt or copy at http://www.boost.org/LICENSE_1_0.txt)

// See https://github.com/danielaparker/jsoncons for latest version

#ifndef JSONCONS_TAG_TYPE_HPP
#define JSONCONS_TAG_TYPE_HPP

#include <ostream>
#include <jsoncons/config/jsoncons_config.hpp>

namespace jsoncons {

struct null_type
{
    explicit null_type() = default; 
};

struct temp_allocator_arg_t
{
    explicit temp_allocator_arg_t() = default; 
};

constexpr temp_allocator_arg_t temp_allocator_arg{};

#if !defined(JSONCONS_NO_DEPRECATED)

struct result_allocator_arg_t
{
    explicit result_allocator_arg_t() = default; 
};

constexpr result_allocator_arg_t result_allocator_arg{};
#endif

struct half_arg_t
{
    explicit half_arg_t() = default; 
};

constexpr half_arg_t half_arg{};

struct json_array_arg_t
{
    explicit json_array_arg_t() = default; 
};

constexpr json_array_arg_t json_array_arg{};

struct json_object_arg_t
{
    explicit json_object_arg_t() = default; 
};

constexpr json_object_arg_t json_object_arg{};

struct byte_string_arg_t
{
    explicit byte_string_arg_t() = default; 
};

constexpr byte_string_arg_t byte_string_arg{};

struct json_const_pointer_arg_t
{
    explicit json_const_pointer_arg_t() = default; 
};

constexpr json_const_pointer_arg_t json_const_pointer_arg{};
 
enum class semantic_tag : uint8_t 
{
    none = 0,
    undefined = 0x01,
    datetime = 0x02,
    epoch_second = 0x03,
    epoch_milli = 0x04,
    epoch_nano = 0x05,
    bigint = 0x06,
    bigdec = 0x07,
    bigfloat = 0x08,
    float128 = 0x09,
    base16 = 0x1a,
    base64 = 0x1b,
    base64url = 0x1c,
    uri = 0x0d,
    clamped = 0x0e,
    multi_dim_row_major = 0x0f,
    multi_dim_column_major = 0x10,
    ext = 0x11,
    id = 0x12,
    regex = 0x13,
    code = 0x14
#if !defined(JSONCONS_NO_DEPRECATED)
    , big_integer = bigint
    , big_decimal = bigdec
    , big_float = bigfloat
    , date_time = datetime
    , timestamp = epoch_second
#endif
};

template <class CharT>
std::basic_ostream<CharT>& operator<<(std::basic_ostream<CharT>& os, semantic_tag tag)
{
    static constexpr const CharT* na_name = JSONCONS_CSTRING_CONSTANT(CharT, "n/a");
    static constexpr const CharT* undefined_name = JSONCONS_CSTRING_CONSTANT(CharT, "undefined");
    static constexpr const CharT* datetime_name = JSONCONS_CSTRING_CONSTANT(CharT, "datetime");
    static constexpr const CharT* epoch_second_name = JSONCONS_CSTRING_CONSTANT(CharT, "epoch-second");
    static constexpr const CharT* epoch_milli_name = JSONCONS_CSTRING_CONSTANT(CharT, "epoch-milli");
    static constexpr const CharT* epoch_nano_name = JSONCONS_CSTRING_CONSTANT(CharT, "epoch-nano");
    static constexpr const CharT* bigint_name = JSONCONS_CSTRING_CONSTANT(CharT, "bigint");
    static constexpr const CharT* bigdec_name = JSONCONS_CSTRING_CONSTANT(CharT, "bigdec");
    static constexpr const CharT* bigfloat_name = JSONCONS_CSTRING_CONSTANT(CharT, "bigfloat");
    static constexpr const CharT* base16_name = JSONCONS_CSTRING_CONSTANT(CharT, "base16");
    static constexpr const CharT* base64_name = JSONCONS_CSTRING_CONSTANT(CharT, "base64");
    static constexpr const CharT* base64url_name = JSONCONS_CSTRING_CONSTANT(CharT, "base64url");
    static constexpr const CharT* uri_name = JSONCONS_CSTRING_CONSTANT(CharT, "uri");
    static constexpr const CharT* clamped_name = JSONCONS_CSTRING_CONSTANT(CharT, "clamped");
    static constexpr const CharT* multi_dim_row_major_name = JSONCONS_CSTRING_CONSTANT(CharT, "multi-dim-row-major");
    static constexpr const CharT* multi_dim_column_major_name = JSONCONS_CSTRING_CONSTANT(CharT, "multi-dim-column-major");
    static constexpr const CharT* ext_name = JSONCONS_CSTRING_CONSTANT(CharT, "ext");
    static constexpr const CharT* id_name = JSONCONS_CSTRING_CONSTANT(CharT, "id");
    static constexpr const CharT*  float128_name = JSONCONS_CSTRING_CONSTANT(CharT, "float128");
    static constexpr const CharT*  regex_name = JSONCONS_CSTRING_CONSTANT(CharT, "regex");
    static constexpr const CharT*  code_name = JSONCONS_CSTRING_CONSTANT(CharT, "code");

    switch (tag)
    {
        case semantic_tag::none:
        {
            os << na_name;
            break;
        }
        case semantic_tag::undefined:
        {
            os << undefined_name;
            break;
        }
        case semantic_tag::datetime:
        {
            os << datetime_name;
            break;
        }
        case semantic_tag::epoch_second:
        {
            os << epoch_second_name;
            break;
        }
        case semantic_tag::epoch_milli:
        {
            os << epoch_milli_name;
            break;
        }
        case semantic_tag::epoch_nano:
        {
            os << epoch_nano_name;
            break;
        }
        case semantic_tag::bigint:
        {
            os << bigint_name;
            break;
        }
        case semantic_tag::bigdec:
        {
            os << bigdec_name;
            break;
        }
        case semantic_tag::bigfloat:
        {
            os << bigfloat_name;
            break;
        }
        case semantic_tag::float128:
        {
            os << float128_name;
            break;
        }
        case semantic_tag::base16:
        {
            os << base16_name;
            break;
        }
        case semantic_tag::base64:
        {
            os << base64_name;
            break;
        }
        case semantic_tag::base64url:
        {
            os << base64url_name;
            break;
        }
        case semantic_tag::uri:
        {
            os << uri_name;
            break;
        }
        case semantic_tag::clamped:
        {
            os << clamped_name;
            break;
        }
        case semantic_tag::multi_dim_row_major:
        {
            os << multi_dim_row_major_name;
            break;
        }
        case semantic_tag::multi_dim_column_major:
        {
            os << multi_dim_column_major_name;
            break;
        }
        case semantic_tag::ext:
        {
            os << ext_name;
            break;
        }
        case semantic_tag::id:
        {
            os << id_name;
            break;
        }
        case semantic_tag::regex:
        {
            os << regex_name;
            break;
        }
        case semantic_tag::code:
        {
            os << code_name;
            break;
        }
    }
    return os;
}

#if !defined(JSONCONS_NO_DEPRECATED)
    JSONCONS_DEPRECATED_MSG("Instead, use semantic_tag") typedef semantic_tag semantic_tag_type;
    JSONCONS_DEPRECATED_MSG("Instead, use byte_string_arg_t") typedef byte_string_arg_t bstr_arg_t;
    constexpr byte_string_arg_t bstr_arg{};
#endif

}

#endif
