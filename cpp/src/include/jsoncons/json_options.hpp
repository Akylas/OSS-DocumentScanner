// Copyright 2013-2023 Daniel Parker
// Distributed under the Boost license, Version 1.0.
// (See accompanying file LICENSE_1_0.txt or copy at http://www.boost.org/LICENSE_1_0.txt)

// See https://github.com/danielaparker/jsoncons for latest version

#ifndef JSONCONS_JSON_OPTIONS_HPP
#define JSONCONS_JSON_OPTIONS_HPP

#include <string>
#include <limits> // std::numeric_limits
#include <cwchar>
#include <functional>
#include <jsoncons/json_exception.hpp>
#include <jsoncons/json_error.hpp>
#include <jsoncons/extension_traits.hpp>
#include <jsoncons/ser_context.hpp>

namespace jsoncons {

enum class float_chars_format : uint8_t {general,fixed,scientific,hex};

#if !defined(JSONCONS_NO_DEPRECATED)
JSONCONS_DEPRECATED_MSG("Instead, use float_chars_format") typedef float_chars_format chars_format;
#endif

enum class indenting : uint8_t {no_indent = 0, indent = 1};

// legacy
using indenting = indenting;

enum class line_split_kind  : uint8_t {same_line,new_line,multi_line};

enum class bigint_chars_format : uint8_t {number, base10, base64, base64url
#if !defined(JSONCONS_NO_DEPRECATED)
,integer = number
#endif
};

#if !defined(JSONCONS_NO_DEPRECATED)
JSONCONS_DEPRECATED_MSG("Instead, use bigint_chars_format") typedef bigint_chars_format bignum_chars_format;
JSONCONS_DEPRECATED_MSG("Instead, use bigint_chars_format") typedef bigint_chars_format big_integer_chars_format;
#endif

enum class byte_string_chars_format : uint8_t {none=0,base16,base64,base64url};

enum class spaces_option : uint8_t {no_spaces=0,space_after,space_before,space_before_and_after};


struct default_json_parsing
{
    bool operator()(json_errc ec, const ser_context&) noexcept 
    {
        return ec == json_errc::illegal_comment;
    }
};

struct strict_json_parsing
{
    bool operator()(json_errc, const ser_context&) noexcept
    {
        return false;
    }
};

struct allow_trailing_commas
{
    bool operator()(const std::error_code& ec, const ser_context&) noexcept 
    {
        return ec == json_errc::illegal_comment || ec == jsoncons::json_errc::extra_comma;
    }
};

#if !defined(JSONCONS_NO_DEPRECATED)
JSONCONS_DEPRECATED_MSG("Instead, use default_json_parsing") typedef default_json_parsing default_parse_error_handler;
JSONCONS_DEPRECATED_MSG("Instead, use strict_json_parsing") typedef strict_json_parsing strict_parse_error_handler;
#endif

template <class CharT>
class basic_json_options;

template <class CharT>
class basic_json_options_common
{
    friend class basic_json_options<CharT>;
public:
    using char_type = CharT;
    using string_type = std::basic_string<CharT>;
private:
#if !defined(JSONCONS_NO_DEPRECATED)
    bool can_read_nan_replacement_;
    bool can_read_pos_inf_replacement_;
    bool can_read_neg_inf_replacement_;
    string_type nan_replacement_;
    string_type pos_inf_replacement_;
    string_type neg_inf_replacement_;
#endif

    bool enable_nan_to_num_:1;
    bool enable_inf_to_num_:1;
    bool enable_neginf_to_num_:1;
    bool enable_nan_to_str_:1;
    bool enable_inf_to_str_:1;
    bool enable_neginf_to_str_:1;
    bool enable_str_to_nan_:1;
    bool enable_str_to_inf_:1;
    bool enable_str_to_neginf_:1;

    string_type nan_to_num_;
    string_type inf_to_num_;
    string_type neginf_to_num_;
    string_type nan_to_str_;
    string_type inf_to_str_;
    string_type neginf_to_str_;
    int max_nesting_depth_;

protected:
    basic_json_options_common()
       :
#if !defined(JSONCONS_NO_DEPRECATED)
          can_read_nan_replacement_(false),
          can_read_pos_inf_replacement_(false),
          can_read_neg_inf_replacement_(false),
#endif
        enable_nan_to_num_(false),
        enable_inf_to_num_(false),
        enable_neginf_to_num_(false),
        enable_nan_to_str_(false),
        enable_inf_to_str_(false),
        enable_neginf_to_str_(false),
        enable_str_to_nan_(false),
        enable_str_to_inf_(false),
        enable_str_to_neginf_(false),
        max_nesting_depth_(1024)
    {}

    virtual ~basic_json_options_common() noexcept = default;

    basic_json_options_common(const basic_json_options_common&) = default;
    basic_json_options_common& operator=(const basic_json_options_common&) = default;
    basic_json_options_common(basic_json_options_common&&) = default;
    basic_json_options_common& operator=(basic_json_options_common&&) = default;

public:

    bool enable_nan_to_num() const
    {
        return enable_nan_to_num_;
    }

    bool enable_inf_to_num() const
    {
        return enable_inf_to_num_;
    }

    bool enable_neginf_to_num() const
    {
        return enable_neginf_to_num_ || enable_inf_to_num_;
    }

    bool enable_nan_to_str() const
    {
        return enable_nan_to_str_;
    }

    bool enable_str_to_nan() const
    {
        return enable_str_to_nan_;
    }

    bool enable_inf_to_str() const
    {
        return enable_inf_to_str_;
    }

    bool enable_str_to_inf() const
    {
        return enable_str_to_inf_;
    }

    bool enable_neginf_to_str() const
    {
        return enable_neginf_to_str_ || enable_inf_to_str_;
    }

    bool enable_str_to_neginf() const
    {
        return enable_str_to_neginf_ || enable_str_to_inf_;
    }

    string_type nan_to_num() const
    {
        if (enable_nan_to_num_)
        {
            return nan_to_num_;
        }
#if !defined(JSONCONS_NO_DEPRECATED)
        else if (!can_read_nan_replacement_) // not string
        {
            return nan_replacement_;
        }
#endif
        else
        {
            return nan_to_num_; // empty string
        }
    }

    string_type inf_to_num() const
    {
        if (enable_inf_to_num_)
        {
            return inf_to_num_;
        }
#if !defined(JSONCONS_NO_DEPRECATED)
        else if (!can_read_pos_inf_replacement_) // not string
        {
            return pos_inf_replacement_;
        }
#endif
        else
        {
            return inf_to_num_; // empty string
        }
    }

    string_type neginf_to_num() const
    {
        if (enable_neginf_to_num_)
        {
            return neginf_to_num_;
        }
        else if (enable_inf_to_num_)
        {
            string_type s;
            s.push_back('-');
            s.append(inf_to_num_);
            return s;
        }
#if !defined(JSONCONS_NO_DEPRECATED)
        else if (!can_read_neg_inf_replacement_) // not string
        {
            return neg_inf_replacement_;
        }
#endif
        else
        {
            return neginf_to_num_; // empty string
        }
    }

    string_type nan_to_str() const
    {
        if (enable_nan_to_str_)
        {
            return nan_to_str_;
        }
#if !defined(JSONCONS_NO_DEPRECATED)
        else if (can_read_nan_replacement_ && nan_replacement_.size() >= 2) // string
        {
            return nan_replacement_.substr(1, nan_replacement_.size() - 2); // Remove quotes
        }
#endif
        else
        {
            return nan_to_str_; // empty string
        }
    }

    string_type inf_to_str() const
    {
        if (enable_inf_to_str_)
        {
            return inf_to_str_;
        }
#if !defined(JSONCONS_NO_DEPRECATED)
        else if (can_read_pos_inf_replacement_ && pos_inf_replacement_.size() >= 2) // string
        {
            return pos_inf_replacement_.substr(1, pos_inf_replacement_.size() - 2); // Strip quotes
        }
#endif
        else
        {
            return inf_to_str_; // empty string
        }
    }

    string_type neginf_to_str() const
    {
        if (enable_neginf_to_str_)
        {
            return neginf_to_str_;
        }
        else if (enable_inf_to_str_)
        {
            string_type s;
            s.push_back('-');
            s.append(inf_to_str_);
            return s;
        }
#if !defined(JSONCONS_NO_DEPRECATED)
        else if (can_read_neg_inf_replacement_ && neg_inf_replacement_.size() >= 2) // string
        {
            return neg_inf_replacement_.substr(1, neg_inf_replacement_.size() - 2); // Strip quotes
        }
#endif
        else
        {
            return neginf_to_str_; // empty string
        }
    }

    int max_nesting_depth() const 
    {
        return max_nesting_depth_;
    }

#if !defined(JSONCONS_NO_DEPRECATED)
    JSONCONS_DEPRECATED_MSG("Instead, use enable_nan_to_num() or enable_nan_to_str()")
    bool can_read_nan_replacement() const { return can_read_nan_replacement_; }

    JSONCONS_DEPRECATED_MSG("Instead, use enable_inf_to_num() or enable_inf_to_str()")
    bool can_read_pos_inf_replacement() const { return can_read_pos_inf_replacement_; }

    JSONCONS_DEPRECATED_MSG("Instead, use enable_neginf_to_num() or enable_neginf_to_str()")
    bool can_read_neg_inf_replacement() const { return can_read_neg_inf_replacement_; }

    bool can_write_nan_replacement() const { return !nan_replacement_.empty(); }

    bool can_write_pos_inf_replacement() const { return !pos_inf_replacement_.empty(); }

    bool can_write_neg_inf_replacement() const { return !neg_inf_replacement_.empty(); }

    JSONCONS_DEPRECATED_MSG("Instead, use nan_to_num() or nan_to_str()")
    const string_type& nan_replacement() const
    {
        return nan_replacement_;
    }

    JSONCONS_DEPRECATED_MSG("Instead, use inf_to_num() or inf_to_str()")
    const string_type& pos_inf_replacement() const
    {
        return pos_inf_replacement_;
    }

    JSONCONS_DEPRECATED_MSG("Instead, use neginf_to_num() or neginf_to_str()")
    const string_type& neg_inf_replacement() const
    {
        return neg_inf_replacement_;
    }
#endif
};

template <class CharT>
class basic_json_decode_options : public virtual basic_json_options_common<CharT>
{
    friend class basic_json_options<CharT>;
    using super_type = basic_json_options_common<CharT>;
public:
    using typename super_type::char_type;
    using typename super_type::string_type;
private:
    bool lossless_number_;
    std::function<bool(json_errc,const ser_context&)> err_handler_;
public:
    basic_json_decode_options()
        : lossless_number_(false), err_handler_(default_json_parsing())
    {
    }

    basic_json_decode_options(const basic_json_decode_options&) = default;

    basic_json_decode_options(basic_json_decode_options&& other)
        : super_type(std::move(other)), lossless_number_(other.lossless_number_), err_handler_(std::move(other.err_handler_))
    {
    }

    basic_json_decode_options& operator=(const basic_json_decode_options&) = default;

    bool lossless_number() const 
    {
        return lossless_number_;
    }

    const std::function<bool(json_errc,const ser_context&)>& err_handler() const 
    {
        return err_handler_;
    }

#if !defined(JSONCONS_NO_DEPRECATED)
    JSONCONS_DEPRECATED_MSG("Instead, use lossless_number()")
    bool dec_to_str() const 
    {
        return lossless_number_;
    }
#endif
};

template <class CharT>
class basic_json_encode_options : public virtual basic_json_options_common<CharT>
{
    friend class basic_json_options<CharT>;
    using super_type = basic_json_options_common<CharT>;
public:
    using typename super_type::char_type;
    using typename super_type::string_type;

    static constexpr uint8_t indent_size_default = 4;
    static constexpr size_t line_length_limit_default = 120;
private:
    bool escape_all_non_ascii_:1;
    bool escape_solidus_:1;
    bool pad_inside_object_braces_:1;
    bool pad_inside_array_brackets_:1;
    float_chars_format float_format_;
    byte_string_chars_format byte_string_format_;
    bigint_chars_format bigint_format_;
    line_split_kind object_object_line_splits_;
    line_split_kind object_array_line_splits_;
    line_split_kind array_array_line_splits_;
    line_split_kind array_object_line_splits_;
    spaces_option spaces_around_colon_;
    spaces_option spaces_around_comma_;
    int8_t precision_;
    uint8_t indent_size_;
    std::size_t line_length_limit_;
    string_type new_line_chars_;
public:
    basic_json_encode_options()
        : escape_all_non_ascii_(false),
          escape_solidus_(false),
          pad_inside_object_braces_(false),
          pad_inside_array_brackets_(false),
          float_format_(float_chars_format::general),
          byte_string_format_(byte_string_chars_format::none),
          bigint_format_(bigint_chars_format::base10),
          object_object_line_splits_(line_split_kind::multi_line),
          object_array_line_splits_(line_split_kind::same_line),
          array_array_line_splits_(line_split_kind::new_line),
          array_object_line_splits_(line_split_kind::multi_line),
          spaces_around_colon_(spaces_option::space_after),
          spaces_around_comma_(spaces_option::space_after),
          precision_(0),
          indent_size_(indent_size_default),
          line_length_limit_(line_length_limit_default)
    {
        new_line_chars_.push_back('\n');
    }

    basic_json_encode_options(const basic_json_encode_options&) = default;

    basic_json_encode_options(basic_json_encode_options&& other)
        : super_type(std::move(other)),
          escape_all_non_ascii_(other.escape_all_non_ascii_),
          escape_solidus_(other.escape_solidus_),
          pad_inside_object_braces_(other.pad_inside_object_braces_),
          pad_inside_array_brackets_(other.pad_inside_array_brackets_),
          float_format_(other.float_format_),
          byte_string_format_(other.byte_string_format_),
          bigint_format_(other.bigint_format_),
          object_object_line_splits_(other.object_object_line_splits_),
          object_array_line_splits_(other.object_array_line_splits_),
          array_array_line_splits_(other.array_array_line_splits_),
          array_object_line_splits_(other.array_object_line_splits_),
          spaces_around_colon_(other.spaces_around_colon_),
          spaces_around_comma_(other.spaces_around_comma_),
          precision_(other.precision_),
          indent_size_(other.indent_size_),
          line_length_limit_(other.line_length_limit_),
          new_line_chars_(std::move(other.new_line_chars_))
    {
    }

    basic_json_encode_options& operator=(const basic_json_encode_options&) = default;

    byte_string_chars_format byte_string_format() const  {return byte_string_format_;}

    bigint_chars_format bigint_format() const  {return bigint_format_;}

    line_split_kind object_object_line_splits() const  {return object_object_line_splits_;}

    line_split_kind array_object_line_splits() const  {return array_object_line_splits_;}

    line_split_kind object_array_line_splits() const  {return object_array_line_splits_;}

    line_split_kind array_array_line_splits() const  {return array_array_line_splits_;}

    uint8_t indent_size() const 
    {
        return indent_size_;
    }

    spaces_option spaces_around_colon() const 
    {
        return spaces_around_colon_;
    }

    spaces_option spaces_around_comma() const 
    {
        return spaces_around_comma_;
    }

    bool pad_inside_object_braces() const 
    {
        return pad_inside_object_braces_;
    }

    bool pad_inside_array_brackets() const 
    {
        return pad_inside_array_brackets_;
    }

    string_type new_line_chars() const 
    {
        return new_line_chars_;
    }

    std::size_t line_length_limit() const 
    {
        return line_length_limit_;
    }

    float_chars_format float_format() const 
    {
        return float_format_;
    }

    int8_t precision() const 
    {
        return precision_;
    }

    bool escape_all_non_ascii() const 
    {
        return escape_all_non_ascii_;
    }

    bool escape_solidus() const 
    {
        return escape_solidus_;
    }

#if !defined(JSONCONS_NO_DEPRECATED)
    JSONCONS_DEPRECATED_MSG("Instead, use bigint_format()")
    bigint_chars_format bignum_format() const {return bigint_format_;}

    JSONCONS_DEPRECATED_MSG("Instead, use indent_size()")
    uint8_t indent() const 
    {
        return indent_size();
    }

    JSONCONS_DEPRECATED_MSG("Instead, use object_object_line_splits()")
    line_split_kind object_object_split_lines() const {return object_object_line_splits_;}

    JSONCONS_DEPRECATED_MSG("Instead, use array_object_line_splits()")
    line_split_kind array_object_split_lines() const {return array_object_line_splits_;}

    JSONCONS_DEPRECATED_MSG("Instead, use object_array_line_splits()")
    line_split_kind object_array_split_lines() const {return object_array_line_splits_;}

    JSONCONS_DEPRECATED_MSG("Instead, use array_array_line_splits()")
    line_split_kind array_array_split_lines() const {return array_array_line_splits_;}
#endif
};

template <class CharT>
class basic_json_options final: public basic_json_decode_options<CharT>, 
                                public basic_json_encode_options<CharT>
{
public:
    using char_type = CharT;
    using string_type = std::basic_string<CharT>;

    using basic_json_options_common<CharT>::max_nesting_depth;

    using basic_json_decode_options<CharT>::enable_str_to_nan;
    using basic_json_decode_options<CharT>::enable_str_to_inf;
    using basic_json_decode_options<CharT>::enable_str_to_neginf;
    using basic_json_decode_options<CharT>::nan_to_str;
    using basic_json_decode_options<CharT>::inf_to_str;
    using basic_json_decode_options<CharT>::neginf_to_str;
    using basic_json_decode_options<CharT>::nan_to_num;
    using basic_json_decode_options<CharT>::inf_to_num;
    using basic_json_decode_options<CharT>::neginf_to_num;

    using basic_json_decode_options<CharT>::lossless_number;
    using basic_json_decode_options<CharT>::err_handler;

    using basic_json_encode_options<CharT>::byte_string_format;
    using basic_json_encode_options<CharT>::bigint_format;
    using basic_json_encode_options<CharT>::object_object_line_splits;
    using basic_json_encode_options<CharT>::array_object_line_splits;
    using basic_json_encode_options<CharT>::object_array_line_splits;
    using basic_json_encode_options<CharT>::array_array_line_splits;
    using basic_json_encode_options<CharT>::indent_size;
    using basic_json_encode_options<CharT>::spaces_around_colon;
    using basic_json_encode_options<CharT>::spaces_around_comma;
    using basic_json_encode_options<CharT>::pad_inside_object_braces;
    using basic_json_encode_options<CharT>::pad_inside_array_brackets;
    using basic_json_encode_options<CharT>::new_line_chars;
    using basic_json_encode_options<CharT>::line_length_limit;
    using basic_json_encode_options<CharT>::float_format;
    using basic_json_encode_options<CharT>::precision;
    using basic_json_encode_options<CharT>::escape_all_non_ascii;
    using basic_json_encode_options<CharT>::escape_solidus;
public:

//  Constructors

    basic_json_options() = default;
    basic_json_options(const basic_json_options&) = default;
    basic_json_options(basic_json_options&&) = default;
    basic_json_options& operator=(const basic_json_options&) = default;
    basic_json_options& operator=(basic_json_options&&) = default;

    basic_json_options& nan_to_num(const string_type& value)
    {
        this->enable_nan_to_num_ = true;
        this->nan_to_str_.clear();
        this->nan_to_num_ = value;
        return *this;
    }

    basic_json_options& inf_to_num(const string_type& value)
    {
        this->enable_inf_to_num_ = true;
        this->inf_to_str_.clear();
        this->inf_to_num_ = value;
        return *this;
    }

    basic_json_options& neginf_to_num(const string_type& value)
    {
        this->enable_neginf_to_num_ = true;
        this->neginf_to_str_.clear();
        this->neginf_to_num_ = value;
        return *this;
    }

    basic_json_options& nan_to_str(const string_type& value, bool enable_inverse = true)
    {
        this->enable_nan_to_str_ = true;
        this->enable_str_to_nan_ = enable_inverse;
        this->nan_to_num_.clear();
        this->nan_to_str_ = value;
        return *this;
    }

    basic_json_options& inf_to_str(const string_type& value, bool enable_inverse = true)
    {
        this->enable_inf_to_str_ = true;
        this->enable_str_to_inf_ = enable_inverse;
        this->inf_to_num_.clear();
        this->inf_to_str_ = value;
        return *this;
    }

    basic_json_options& neginf_to_str(const string_type& value, bool enable_inverse = true)
    {
        this->enable_neginf_to_str_ = true;
        this->enable_str_to_neginf_ = enable_inverse;
        this->neginf_to_num_.clear();
        this->neginf_to_str_ = value;
        return *this;
    }

    JSONCONS_DEPRECATED_MSG("Instead, use inf_to_num(const string_type&) or inf_to_str(const string_type&)")
        basic_json_options& replace_inf(bool replace)
    {
        this->can_read_pos_inf_replacement_ = replace;
        this->can_read_neg_inf_replacement_ = replace;
        return *this;
    }

    JSONCONS_DEPRECATED_MSG("Instead, use inf_to_num(const string_type&) or inf_to_str(const string_type&)")
        basic_json_options& replace_pos_inf(bool replace)
    {
        this->can_read_pos_inf_replacement_ = replace;
        return *this;
    }

    JSONCONS_DEPRECATED_MSG("Instead, use neginf_to_num(const string_type&) or neginf_to_str(const string_type&)")
        basic_json_options& replace_neg_inf(bool replace)
    {
        this->can_read_neg_inf_replacement_ = replace;
        return *this;
    }

    JSONCONS_DEPRECATED_MSG("Instead, use nan_to_num(const string_type&) or nan_to_str(const string_type&)")
        basic_json_options& nan_replacement(const string_type& value)
    {
        this->nan_replacement_ = value;

        this->can_read_nan_replacement_ = is_string(value);

        return *this;
    }

    JSONCONS_DEPRECATED_MSG("Instead, use inf_to_num(const string_type&) or inf_to_str(const string_type&)")
        basic_json_options& pos_inf_replacement(const string_type& value)
    {
        this->pos_inf_replacement_ = value;
        this->can_read_pos_inf_replacement_ = is_string(value);
        return *this;
    }

    JSONCONS_DEPRECATED_MSG("Instead, use neginf_to_num(const string_type&) or neginf_to_str(const string_type&)")
        basic_json_options& neg_inf_replacement(const string_type& value)
    {
        this->neg_inf_replacement_ = value;
        this->can_read_neg_inf_replacement_ = is_string(value);
        return *this;
    }

    basic_json_options&  byte_string_format(byte_string_chars_format value) {this->byte_string_format_ = value; return *this;}

    basic_json_options&  bigint_format(bigint_chars_format value) {this->bigint_format_ = value; return *this;}

    basic_json_options& object_object_line_splits(line_split_kind value) {this->object_object_line_splits_ = value; return *this;}

    basic_json_options& array_object_line_splits(line_split_kind value) {this->array_object_line_splits_ = value; return *this;}

    basic_json_options& object_array_line_splits(line_split_kind value) {this->object_array_line_splits_ = value; return *this;}

    basic_json_options& array_array_line_splits(line_split_kind value) {this->array_array_line_splits_ = value; return *this;}

    basic_json_options& indent_size(uint8_t value)
    {
        this->indent_size_ = value;
        return *this;
    }

    basic_json_options& spaces_around_colon(spaces_option value)
    {
        this->spaces_around_colon_ = value;
        return *this;
    }

    basic_json_options& spaces_around_comma(spaces_option value)
    {
        this->spaces_around_comma_ = value;
        return *this;
    }

    basic_json_options& pad_inside_object_braces(bool value)
    {
        this->pad_inside_object_braces_ = value;
        return *this;
    }

    basic_json_options& pad_inside_array_brackets(bool value)
    {
        this->pad_inside_array_brackets_ = value;
        return *this;
    }

    basic_json_options& new_line_chars(const string_type& value)
    {
        this->new_line_chars_ = value;
        return *this;
    }

    basic_json_options& lossless_number(bool value) 
    {
        this->lossless_number_ = value;
        return *this;
    }

    basic_json_options& err_handler(const std::function<bool(json_errc,const ser_context&)>& value) 
    {
        this->err_handler_ = value;
        return *this;
    }

    basic_json_options& line_length_limit(std::size_t value)
    {
        this->line_length_limit_ = value;
        return *this;
    }

    basic_json_options& float_format(float_chars_format value)
    {
        this->float_format_ = value;
        return *this;
    }

    basic_json_options& precision(int8_t value)
    {
        this->precision_ = value;
        return *this;
    }

    basic_json_options& escape_all_non_ascii(bool value)
    {
        this->escape_all_non_ascii_ = value;
        return *this;
    }

    basic_json_options& escape_solidus(bool value)
    {
        this->escape_solidus_ = value;
        return *this;
    }

    basic_json_options& max_nesting_depth(int value)
    {
        this->max_nesting_depth_ = value;
        return *this;
    }

#if !defined(JSONCONS_NO_DEPRECATED)
    JSONCONS_DEPRECATED_MSG("Instead, use bigint_format(bigint_chars_format)")
    basic_json_options&  big_integer_format(bigint_chars_format value) {this->bigint_format_ = value; return *this;}

    JSONCONS_DEPRECATED_MSG("Instead, use bigint_format(bigint_chars_format)")
    basic_json_options&  bignum_format(bigint_chars_format value) {this->bigint_format_ = value; return *this;}

    JSONCONS_DEPRECATED_MSG("Instead, use float_format(float_chars_format)")
    basic_json_options& floating_point_format(float_chars_format value)
    {
        this->float_format_ = value;
        return *this;
    }

    JSONCONS_DEPRECATED_MSG("Instead, use lossless_number(bool)")
    basic_json_options& dec_to_str(bool value) 
    {
        this->lossless_number_ = value;
        return *this;
    }

    JSONCONS_DEPRECATED_MSG("Instead, use indent_size(uint8_t_t)")
    basic_json_options& indent(uint8_t value)
    {
        return indent_size(value);
    }

    JSONCONS_DEPRECATED_MSG("Instead, use object_object_line_splits(line_split_kind)")
    basic_json_options& object_object_split_lines(line_split_kind value) {this->object_object_line_splits_ = value; return *this;}

    JSONCONS_DEPRECATED_MSG("Instead, use array_object_line_splits(line_split_kind)")
    basic_json_options& array_object_split_lines(line_split_kind value) {this->array_object_line_splits_ = value; return *this;}

    JSONCONS_DEPRECATED_MSG("Instead, use object_array_line_splits(line_split_kind)")
    basic_json_options& object_array_split_lines(line_split_kind value) {this->object_array_line_splits_ = value; return *this;}

    JSONCONS_DEPRECATED_MSG("Instead, use array_array_line_splits(line_split_kind)")
    basic_json_options& array_array_split_lines(line_split_kind value) {this->array_array_line_splits_ = value; return *this;}
#endif
private:
    enum class input_state {initial,begin_quote,character,end_quote,escape,error};
    bool is_string(const string_type& s) const
    {
        input_state state = input_state::initial;
        for (char_type c : s)
        {
            switch (c)
            {
            case '\t': case ' ': case '\n': case'\r':
                break;
            case '\\':
                state = input_state::escape;
                break;
            case '\"':
                switch (state)
                {
                case input_state::initial:
                    state = input_state::begin_quote;
                    break;
                case input_state::begin_quote:
                case input_state::character:
                    state = input_state::end_quote;
                    break;
                case input_state::end_quote:
                    state = input_state::error;
                    break;
                case input_state::escape:
                    state = input_state::character;
                    break;
                default:
                    state = input_state::character;
                    break;
                }
                break;
            default:
                break;
            }

        }
        return state == input_state::end_quote;
    }
};

using json_options = basic_json_options<char>;
using wjson_options = basic_json_options<wchar_t>;

#if !defined(JSONCONS_NO_DEPRECATED)
JSONCONS_DEPRECATED_MSG("json_options") typedef json_options output_format;
JSONCONS_DEPRECATED_MSG("wjson_options") typedef wjson_options woutput_format;
JSONCONS_DEPRECATED_MSG("json_options") typedef json_options serialization_options;
JSONCONS_DEPRECATED_MSG("wjson_options") typedef wjson_options wserialization_options;
JSONCONS_DEPRECATED_MSG("json_options") typedef json_options json_serializing_options;
JSONCONS_DEPRECATED_MSG("wjson_options") typedef wjson_options wjson_serializing_options;
#endif

}
#endif
