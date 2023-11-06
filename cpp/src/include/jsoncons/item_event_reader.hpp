// Copyright 2013-2023 Daniel Parker
// Distributed under the Boost license, Version 1.0.
// (See accompanying file LICENSE_1_0.txt or copy at http://www.boost.org/LICENSE_1_0.txt)

// See https://github.com/danielaparker/jsoncons for latest version

#ifndef JSONCONS_ITEM_EVENT_READER_HPP
#define JSONCONS_ITEM_EVENT_READER_HPP

#include <memory> // std::allocator
#include <string>
#include <stdexcept>
#include <system_error>
#include <ios>
#include <type_traits> // std::enable_if
#include <array> // std::array
#include <functional> // std::function
#include <jsoncons/json_exception.hpp>
#include <jsoncons/item_event_visitor.hpp>
#include <jsoncons/bigint.hpp>
#include <jsoncons/json_parser.hpp>
#include <jsoncons/ser_context.hpp>
#include <jsoncons/sink.hpp>
#include <jsoncons/detail/write_number.hpp>
#include <jsoncons/json_type_traits.hpp>
#include <jsoncons/typed_array_view.hpp>
#include <jsoncons/value_converter.hpp>

namespace jsoncons {

    enum class item_event_kind
    {
        begin_array,
        end_array,
        begin_object,
        end_object,
        string_value,
        byte_string_value,
        null_value,
        bool_value,
        int64_value,
        uint64_value,
        half_value,
        double_value
    };

    template <class CharT>
    std::basic_ostream<CharT>& operator<<(std::basic_ostream<CharT>& os, item_event_kind tag)
    {
        static constexpr const CharT* begin_array_name = JSONCONS_CSTRING_CONSTANT(CharT, "begin_array");
        static constexpr const CharT* end_array_name = JSONCONS_CSTRING_CONSTANT(CharT, "end_array");
        static constexpr const CharT* begin_object_name = JSONCONS_CSTRING_CONSTANT(CharT, "begin_object");
        static constexpr const CharT* end_object_name = JSONCONS_CSTRING_CONSTANT(CharT, "end_object");
        static constexpr const CharT* string_value_name = JSONCONS_CSTRING_CONSTANT(CharT, "string_value");
        static constexpr const CharT* byte_string_value_name = JSONCONS_CSTRING_CONSTANT(CharT, "byte_string_value");
        static constexpr const CharT* null_value_name = JSONCONS_CSTRING_CONSTANT(CharT, "null_value");
        static constexpr const CharT* bool_value_name = JSONCONS_CSTRING_CONSTANT(CharT, "bool_value");
        static constexpr const CharT* uint64_value_name = JSONCONS_CSTRING_CONSTANT(CharT, "uint64_value");
        static constexpr const CharT* int64_value_name = JSONCONS_CSTRING_CONSTANT(CharT, "int64_value");
        static constexpr const CharT* half_value_name = JSONCONS_CSTRING_CONSTANT(CharT, "half_value");
        static constexpr const CharT* double_value_name = JSONCONS_CSTRING_CONSTANT(CharT, "double_value");

        switch (tag)
        {
            case item_event_kind::begin_array:
            {
                os << begin_array_name;
                break;
            }
            case item_event_kind::end_array:
            {
                os << end_array_name;
                break;
            }
            case item_event_kind::begin_object:
            {
                os << begin_object_name;
                break;
            }
            case item_event_kind::end_object:
            {
                os << end_object_name;
                break;
            }
            case item_event_kind::string_value:
            {
                os << string_value_name;
                break;
            }
            case item_event_kind::byte_string_value:
            {
                os << byte_string_value_name;
                break;
            }
            case item_event_kind::null_value:
            {
                os << null_value_name;
                break;
            }
            case item_event_kind::bool_value:
            {
                os << bool_value_name;
                break;
            }
            case item_event_kind::int64_value:
            {
                os << int64_value_name;
                break;
            }
            case item_event_kind::uint64_value:
            {
                os << uint64_value_name;
                break;
            }
            case item_event_kind::half_value:
            {
                os << half_value_name;
                break;
            }
            case item_event_kind::double_value:
            {
                os << double_value_name;
                break;
            }
        }
        return os;
    }

    template<class CharT>
    class basic_item_event
    {
        item_event_kind event_kind_;
        semantic_tag tag_;
        uint64_t ext_tag_;
        union
        {
            bool bool_value_;
            int64_t int64_value_;
            uint64_t uint64_value_;
            uint16_t half_value_;
            double double_value_;
            const CharT* string_data_;
            const uint8_t* byte_string_data_;
        } value_;
        std::size_t length_;
    public:
        using string_view_type = jsoncons::basic_string_view<CharT>;

        basic_item_event(item_event_kind event_kind, semantic_tag tag = semantic_tag::none)
            : event_kind_(event_kind), tag_(tag), ext_tag_(0), value_(), length_(0)
        {
        }

        basic_item_event(item_event_kind event_kind, std::size_t length, semantic_tag tag = semantic_tag::none)
            : event_kind_(event_kind), tag_(tag), ext_tag_(0), value_(), length_(length)
        {
        }

        basic_item_event(null_type, semantic_tag tag)
            : event_kind_(item_event_kind::null_value), tag_(tag), ext_tag_(0), value_(), length_(0)
        {
        }

        basic_item_event(bool value, semantic_tag tag)
            : event_kind_(item_event_kind::bool_value), tag_(tag), ext_tag_(0), length_(0)
        {
            value_.bool_value_ = value;
        }

        basic_item_event(int64_t value, semantic_tag tag)
            : event_kind_(item_event_kind::int64_value), tag_(tag), ext_tag_(0), length_(0)
        {
            value_.int64_value_ = value;
        }

        basic_item_event(uint64_t value, semantic_tag tag)
            : event_kind_(item_event_kind::uint64_value), tag_(tag), ext_tag_(0), length_(0)
        {
            value_.uint64_value_ = value;
        }

        basic_item_event(half_arg_t, uint16_t value, semantic_tag tag)
            : event_kind_(item_event_kind::half_value), tag_(tag), ext_tag_(0), length_(0)
        {
            value_.half_value_ = value;
        }

        basic_item_event(double value, semantic_tag tag)
            : event_kind_(item_event_kind::double_value), tag_(tag), ext_tag_(0), length_(0)
        {
            value_.double_value_ = value;
        }

        basic_item_event(const string_view_type& s,
            item_event_kind event_kind,
            semantic_tag tag = semantic_tag::none)
            : event_kind_(event_kind), tag_(tag), ext_tag_(0), length_(s.length())
        {
            value_.string_data_ = s.data();
        }

        basic_item_event(const byte_string_view& s,
            item_event_kind event_kind,
            semantic_tag tag = semantic_tag::none)
            : event_kind_(event_kind), tag_(tag), ext_tag_(0), length_(s.size())
        {
            value_.byte_string_data_ = s.data();
        }

        basic_item_event(const byte_string_view& s,
            item_event_kind event_kind,
            uint64_t ext_tag)
            : event_kind_(event_kind), tag_(semantic_tag::ext), ext_tag_(ext_tag), length_(s.size())
        {
            value_.byte_string_data_ = s.data();
        }

        std::size_t size() const
        {
            return length_;
        }

        template <class T>
        T get() const
        {
            std::error_code ec;
            T val = get<T>(ec);
            if (ec)
            {
                JSONCONS_THROW(ser_error(ec));
            }
            return val;
        }

        template<class T, class CharT_ = CharT>
        typename std::enable_if<extension_traits::is_string<T>::value && std::is_same<typename T::value_type, CharT_>::value, T>::type
        get(std::error_code& ec) const
        {
            switch (event_kind_)
            {
                case item_event_kind::string_value:
                {
                    value_converter<jsoncons::basic_string_view<CharT>,T> converter;
                    return converter.convert(jsoncons::basic_string_view<CharT>(value_.string_data_, length_), tag(), ec);
                }
                case item_event_kind::byte_string_value:
                {
                    value_converter<byte_string_view,T> converter;
                    return converter.convert(byte_string_view(value_.byte_string_data_,length_),tag(),ec);
                }
                case item_event_kind::uint64_value:
                {
                    value_converter<uint64_t,T> converter;
                    return converter.convert(value_.uint64_value_, tag(), ec);
                }
                case item_event_kind::int64_value:
                {
                    value_converter<int64_t,T> converter;
                    return converter.convert(value_.int64_value_, tag(), ec);
                }
                case item_event_kind::half_value:
                {
                    value_converter<half_arg_t,T> converter;
                    return converter.convert(value_.half_value_, tag(), ec);
                }
                case item_event_kind::double_value:
                {
                    value_converter<double,T> converter;
                    return converter.convert(value_.double_value_, tag(), ec);
                }
                case item_event_kind::bool_value:
                {
                    value_converter<bool,T> converter;
                    return converter.convert(value_.bool_value_,tag(),ec);
                }
                case item_event_kind::null_value:
                {
                    value_converter<null_type,T> converter;
                    return converter.convert(tag(),ec);
                }
                default:
                {
                    ec = conv_errc::not_string;
                    return T{};
                }
            }
        }

        template<class T, class CharT_ = CharT>
        typename std::enable_if<extension_traits::is_string_view<T>::value && std::is_same<typename T::value_type, CharT_>::value, T>::type
            get(std::error_code& ec) const
        {
            T s;
            switch (event_kind_)
            {
            case item_event_kind::string_value:
                s = T(value_.string_data_, length_);
                break;
            default:
                ec = conv_errc::not_string_view;
                break;        
            }
            return s;
        }

        template<class T>
        typename std::enable_if<std::is_same<T, byte_string_view>::value, T>::type
            get(std::error_code& ec) const
        {
            T s;
            switch (event_kind_)
            {
                case item_event_kind::byte_string_value:
                    s = T(value_.byte_string_data_, length_);
                    break;
                default:
                    ec = conv_errc::not_byte_string_view;
                    break;
            }
            return s;
        }

        template<class T>
        typename std::enable_if<extension_traits::is_list_like<T>::value &&
                                std::is_same<typename T::value_type,uint8_t>::value,T>::type
        get(std::error_code& ec) const
        {
            switch (event_kind_)
            {
                case item_event_kind::byte_string_value:
                {
                    value_converter<byte_string_view,T> converter;
                    return converter.convert(byte_string_view(value_.byte_string_data_, length_), tag(), ec);
                }
                case item_event_kind::string_value:
                {
                    value_converter<basic_string_view<CharT>,T> converter;
                    return converter.convert(jsoncons::basic_string_view<CharT>(value_.string_data_, length_), tag(), ec);
                }
                default:
                    ec = conv_errc::not_byte_string;
                    return T{};
            }
        }

        template <class IntegerType>
        typename std::enable_if<extension_traits::is_integer<IntegerType>::value, IntegerType>::type
        get(std::error_code& ec) const
        {
            switch (event_kind_)
            {
                case item_event_kind::string_value:
                {
                    IntegerType val;
                    auto result = jsoncons::detail::to_integer(value_.string_data_, length_, val);
                    if (!result)
                    {
                        ec = conv_errc::not_integer;
                        return IntegerType();
                    }
                    return val;
                }
                case item_event_kind::half_value:
                    return static_cast<IntegerType>(value_.half_value_);
                case item_event_kind::double_value:
                    return static_cast<IntegerType>(value_.double_value_);
                case item_event_kind::int64_value:
                    return static_cast<IntegerType>(value_.int64_value_);
                case item_event_kind::uint64_value:
                    return static_cast<IntegerType>(value_.uint64_value_);
                case item_event_kind::bool_value:
                    return static_cast<IntegerType>(value_.bool_value_ ? 1 : 0);
                default:
                    ec = conv_errc::not_integer;
                    return IntegerType();
            }
        }

        template<class T>
        typename std::enable_if<std::is_floating_point<T>::value, T>::type
            get(std::error_code& ec) const
        {
            return static_cast<T>(as_double(ec));
        }

        template<class T>
        typename std::enable_if<extension_traits::is_bool<T>::value, T>::type
            get(std::error_code& ec) const
        {
            return as_bool(ec);
        }

        item_event_kind event_kind() const noexcept { return event_kind_; }

        semantic_tag tag() const noexcept { return tag_; }

        uint64_t ext_tag() const noexcept { return ext_tag_; }

    private:

        double as_double(std::error_code& ec) const
        {
            switch (event_kind_)
            {
                case item_event_kind::string_value:
                {
                    jsoncons::detail::chars_to f;
                    return f(value_.string_data_, length_);
                }
                case item_event_kind::double_value:
                    return value_.double_value_;
                case item_event_kind::int64_value:
                    return static_cast<double>(value_.int64_value_);
                case item_event_kind::uint64_value:
                    return static_cast<double>(value_.uint64_value_);
                case item_event_kind::half_value:
                {
                    double x = binary::decode_half(value_.half_value_);
                    return static_cast<double>(x);
                }
                default:
                    ec = conv_errc::not_double;
                    return double();
            }
        }

        bool as_bool(std::error_code& ec) const
        {
            switch (event_kind_)
            {
                case item_event_kind::bool_value:
                    return value_.bool_value_;
                case item_event_kind::double_value:
                    return value_.double_value_ != 0.0;
                case item_event_kind::int64_value:
                    return value_.int64_value_ != 0;
                case item_event_kind::uint64_value:
                    return value_.uint64_value_ != 0;
                default:
                    ec = conv_errc::not_bool;
                    return bool();
            }
        }
    public:
        friend bool send_value_event(const basic_item_event<CharT>& ev,
            basic_item_event_visitor<CharT>& visitor,
            const ser_context& context,
            std::error_code& ec)
        {
            switch (ev.event_kind())
            {
                case item_event_kind::begin_array:
                    return visitor.begin_array(ev.tag(), context);
                case item_event_kind::end_array:
                    return visitor.end_array(context);
                case item_event_kind::begin_object:
                    return visitor.begin_object(ev.tag(), context, ec);
                case item_event_kind::end_object:
                    return visitor.end_object(context, ec);
                case item_event_kind::string_value:
                    return visitor.string_value(string_view_type(ev.value_.string_data_,ev.length_), ev.tag(), context);
                case item_event_kind::byte_string_value:
                    return visitor.byte_string_value(byte_string_view(ev.value_.byte_string_data_,ev.length_), ev.tag(), context);
                case item_event_kind::null_value:
                    return visitor.null_value(ev.tag(), context);
                case item_event_kind::bool_value:
                    return visitor.bool_value(ev.value_.bool_value_, ev.tag(), context);
                case item_event_kind::int64_value:
                    return visitor.int64_value(ev.value_.int64_value_, ev.tag(), context);
                case item_event_kind::uint64_value:
                    return visitor.uint64_value(ev.value_.uint64_value_, ev.tag(), context);
                case item_event_kind::half_value:
                    return visitor.half_value(ev.value_.half_value_, ev.tag(), context);
                case item_event_kind::double_value:
                    return visitor.double_value(ev.value_.double_value_, ev.tag(), context);
                default:
                    return false;
            }
        }
    };

    // basic_item_event_receiver

    enum class item_event_reader_state
    {
        typed_array = 1,
        multi_dim,
        shape
    };

    template <class CharT>
    class basic_item_event_receiver : public basic_item_event_visitor<CharT>
    {
        using super_type = basic_item_event_visitor<CharT>;
    public:
        using char_type = CharT;
        using typename super_type::string_view_type;
    private:
        std::function<bool(const basic_item_event<CharT>&, const ser_context&)> pred_;
        basic_item_event<CharT> event_;

        item_event_reader_state state_;
        typed_array_view data_;
        jsoncons::span<const size_t> shape_;
        std::size_t index_;
    public:
        basic_item_event_receiver()
            : pred_(accept), event_(item_event_kind::null_value),
              state_(), data_(), shape_(), index_(0)
        {
        }

        basic_item_event_receiver(std::function<bool(const basic_item_event<CharT>&, const ser_context&)> pred)
            : pred_(pred), event_(item_event_kind::null_value),
              state_(), data_(), shape_(), index_(0)
        {
        }

        void reset()
        {
            event_ = item_event_kind::null_value;
            state_ = {};
            data_ = {};
            shape_ = {};
            index_ = 0;
        }

        const basic_item_event<CharT>& event() const
        {
            return event_;
        }

        bool in_available() const
        {
            return state_ != item_event_reader_state();
        }

        void send_available(std::error_code& ec)
        {
            switch (state_)
            {
                case item_event_reader_state::typed_array:
                    advance_typed_array(ec);
                    break;
                case item_event_reader_state::multi_dim:
                case item_event_reader_state::shape:
                    advance_multi_dim(ec);
                    break;
                default:
                    break;
            }
        }

        bool is_typed_array() const
        {
            return data_.type() != typed_array_type();
        }

        item_event_reader_state state() const
        {
            return state_;
        }

        void advance_typed_array(std::error_code& ec)
        {
            if (is_typed_array())
            {
                if (index_ < data_.size())
                {
                    switch (data_.type())
                    {
                        case typed_array_type::uint8_value:
                        {
                            this->uint64_value(data_.data(uint8_array_arg)[index_], semantic_tag::none, ser_context(), ec);
                            break;
                        }
                        case typed_array_type::uint16_value:
                        {
                            this->uint64_value(data_.data(uint16_array_arg)[index_], semantic_tag::none, ser_context(), ec);
                            break;
                        }
                        case typed_array_type::uint32_value:
                        {
                            this->uint64_value(data_.data(uint32_array_arg)[index_], semantic_tag::none, ser_context(), ec);
                            break;
                        }
                        case typed_array_type::uint64_value:
                        {
                            this->uint64_value(data_.data(uint64_array_arg)[index_], semantic_tag::none, ser_context(), ec);
                            break;
                        }
                        case typed_array_type::int8_value:
                        {
                            this->int64_value(data_.data(int8_array_arg)[index_], semantic_tag::none, ser_context(), ec);
                            break;
                        }
                        case typed_array_type::int16_value:
                        {
                            this->int64_value(data_.data(int16_array_arg)[index_], semantic_tag::none, ser_context(), ec);
                            break;
                        }
                        case typed_array_type::int32_value:
                        {
                            this->int64_value(data_.data(int32_array_arg)[index_], semantic_tag::none, ser_context(), ec);
                            break;
                        }
                        case typed_array_type::int64_value:
                        {
                            this->int64_value(data_.data(int64_array_arg)[index_], semantic_tag::none, ser_context(), ec);
                            break;
                        }
                        case typed_array_type::half_value:
                        {
                            this->half_value(data_.data(half_array_arg)[index_], semantic_tag::none, ser_context(), ec);
                            break;
                        }
                        case typed_array_type::float_value:
                        {
                            this->double_value(data_.data(float_array_arg)[index_], semantic_tag::none, ser_context(), ec);
                            break;
                        }
                        case typed_array_type::double_value:
                        {
                            this->double_value(data_.data(double_array_arg)[index_], semantic_tag::none, ser_context(), ec);
                            break;
                        }
                        default:
                            break;
                    }
                    ++index_;
                }
                else
                {
                    this->end_array();
                    state_ = item_event_reader_state();
                    data_ = typed_array_view();
                    index_ = 0;
                }
            }
        }

        void advance_multi_dim(std::error_code& ec)
        {
            if (shape_.size() != 0)
            {
                if (state_ == item_event_reader_state::multi_dim)
                {
                    this->begin_array(shape_.size(), semantic_tag::none, ser_context(), ec);
                    state_ = item_event_reader_state::shape;
                }
                else if (index_ < shape_.size())
                {
                    this->uint64_value(shape_[index_], semantic_tag::none, ser_context(), ec);
                    ++index_;
                }
                else
                {
                    state_ = item_event_reader_state();
                    this->end_array(ser_context(), ec);
                    shape_ = jsoncons::span<const size_t>();
                    index_ = 0;
                }
            }
        }

        bool dump(basic_item_event_visitor<CharT>& visitor, const ser_context& context, std::error_code& ec)
        {
            bool more = true;
            if (is_typed_array())
            {
                if (index_ != 0)
                {
                    more = send_value_event(event(), visitor, context, ec);
                    while (more && is_typed_array())
                    {
                        if (index_ < data_.size())
                        {
                            switch (data_.type())
                            {
                                case typed_array_type::uint8_value:
                                {
                                    more = visitor.uint64_value(data_.data(uint8_array_arg)[index_]);
                                    break;
                                }
                                case typed_array_type::uint16_value:
                                {
                                    more = visitor.uint64_value(data_.data(uint16_array_arg)[index_]);
                                    break;
                                }
                                case typed_array_type::uint32_value:
                                {
                                    more = visitor.uint64_value(data_.data(uint32_array_arg)[index_]);
                                    break;
                                }
                                case typed_array_type::uint64_value:
                                {
                                    more = visitor.uint64_value(data_.data(uint64_array_arg)[index_]);
                                    break;
                                }
                                case typed_array_type::int8_value:
                                {
                                    more = visitor.int64_value(data_.data(int8_array_arg)[index_]);
                                    break;
                                }
                                case typed_array_type::int16_value:
                                {
                                    more = visitor.int64_value(data_.data(int16_array_arg)[index_]);
                                    break;
                                }
                                case typed_array_type::int32_value:
                                {
                                    more = visitor.int64_value(data_.data(int32_array_arg)[index_]);
                                    break;
                                }
                                case typed_array_type::int64_value:
                                {
                                    more = visitor.int64_value(data_.data(int64_array_arg)[index_]);
                                    break;
                                }
                                case typed_array_type::float_value:
                                {
                                    more = visitor.double_value(data_.data(float_array_arg)[index_]);
                                    break;
                                }
                                case typed_array_type::double_value:
                                {
                                    more = visitor.double_value(data_.data(double_array_arg)[index_]);
                                    break;
                                }
                                default:
                                    break;
                            }
                            ++index_;
                        }
                        else
                        {
                            more = visitor.end_array();
                            state_ = item_event_reader_state();
                            data_ = typed_array_view();
                            index_ = 0;
                        }
                    }
                }
                else
                {
                    switch (data_.type())
                    {
                        case typed_array_type::uint8_value:
                        {
                            more = visitor.typed_array(data_.data(uint8_array_arg));
                            break;
                        }
                        case typed_array_type::uint16_value:
                        {
                            more = visitor.typed_array(data_.data(uint16_array_arg));
                            break;
                        }
                        case typed_array_type::uint32_value:
                        {
                            more = visitor.typed_array(data_.data(uint32_array_arg));
                            break;
                        }
                        case typed_array_type::uint64_value:
                        {
                            more = visitor.typed_array(data_.data(uint64_array_arg));
                            break;
                        }
                        case typed_array_type::int8_value:
                        {
                            more = visitor.typed_array(data_.data(int8_array_arg));
                            break;
                        }
                        case typed_array_type::int16_value:
                        {
                            more = visitor.typed_array(data_.data(int16_array_arg));
                            break;
                        }
                        case typed_array_type::int32_value:
                        {
                            more = visitor.typed_array(data_.data(int32_array_arg));
                            break;
                        }
                        case typed_array_type::int64_value:
                        {
                            more = visitor.typed_array(data_.data(int64_array_arg));
                            break;
                        }
                        case typed_array_type::float_value:
                        {
                            more = visitor.typed_array(data_.data(float_array_arg));
                            break;
                        }
                        case typed_array_type::double_value:
                        {
                            more = visitor.typed_array(data_.data(double_array_arg));
                            break;
                        }
                        default:
                            break;
                    }

                    state_ = item_event_reader_state();
                    data_ = typed_array_view();
                }
            }
            else
            {
                more = send_value_event(event(), visitor, context, ec);
            }
            return more;
        }

    private:
        static constexpr bool accept(const basic_item_event<CharT>&, const ser_context&) 
        {
            return true;
        }

        bool visit_begin_object(semantic_tag tag, const ser_context& context, std::error_code&) override
        {
            event_ = basic_item_event<CharT>(item_event_kind::begin_object, tag);
            return !pred_(event_, context);
        }

        bool visit_begin_object(std::size_t length, semantic_tag tag, const ser_context& context, std::error_code&) override
        {
            event_ = basic_item_event<CharT>(item_event_kind::begin_object, length, tag);
            return !pred_(event_, context);
        }

        bool visit_end_object(const ser_context& context, std::error_code&) override
        {
            event_ = basic_item_event<CharT>(item_event_kind::end_object);
            return !pred_(event_, context);
        }

        bool visit_begin_array(semantic_tag tag, const ser_context& context, std::error_code&) override
        {
            event_ = basic_item_event<CharT>(item_event_kind::begin_array, tag);
            return !pred_(event_, context);
        }

        bool visit_begin_array(std::size_t length, semantic_tag tag, const ser_context& context, std::error_code&) override
        {
            event_ = basic_item_event<CharT>(item_event_kind::begin_array, length, tag);
            return !pred_(event_, context);
        }

        bool visit_end_array(const ser_context& context, std::error_code&) override
        {
            event_ = basic_item_event<CharT>(item_event_kind::end_array);
            return !pred_(event_, context);
        }

        bool visit_null(semantic_tag tag, const ser_context& context, std::error_code&) override
        {
            event_ = basic_item_event<CharT>(item_event_kind::null_value, tag);
            return !pred_(event_, context);
        }

        bool visit_bool(bool value, semantic_tag tag, const ser_context& context, std::error_code&) override
        {
            event_ = basic_item_event<CharT>(value, tag);
            return !pred_(event_, context);
        }

        bool visit_string(const string_view_type& s, semantic_tag tag, const ser_context& context, std::error_code&) override
        {
            event_ = basic_item_event<CharT>(s, item_event_kind::string_value, tag);
            return !pred_(event_, context);
        }

        bool visit_byte_string(const byte_string_view& s, 
                               semantic_tag tag,
                               const ser_context& context,
                               std::error_code&) override
        {
            event_ = basic_item_event<CharT>(s, item_event_kind::byte_string_value, tag);
            return !pred_(event_, context);
        }

        bool visit_byte_string(const byte_string_view& s, 
                               uint64_t ext_tag,
                               const ser_context& context,
                               std::error_code&) override
        {
            event_ = basic_item_event<CharT>(s, item_event_kind::byte_string_value, ext_tag);
            return !pred_(event_, context);
        }

        bool visit_uint64(uint64_t value, 
                             semantic_tag tag, 
                             const ser_context& context,
                             std::error_code&) override
        {
            event_ = basic_item_event<CharT>(value, tag);
            return !pred_(event_, context);
        }

        bool visit_int64(int64_t value, 
                      semantic_tag tag,
                      const ser_context& context,
                      std::error_code&) override
        {
            event_ = basic_item_event<CharT>(value, tag);
            return !pred_(event_, context);
        }

        bool visit_half(uint16_t value, 
                     semantic_tag tag,
                     const ser_context& context,
                     std::error_code&) override
        {
            event_ = basic_item_event<CharT>(half_arg, value, tag);
            return !pred_(event_, context);
        }

        bool visit_double(double value, 
                       semantic_tag tag, 
                       const ser_context& context,
                       std::error_code&) override
        {
            event_ = basic_item_event<CharT>(value, tag);
            return !pred_(event_, context);
        }

        bool visit_typed_array(const jsoncons::span<const uint8_t>& v, 
                            semantic_tag tag,
                            const ser_context& context,
                            std::error_code& ec) override
        {
            state_ = item_event_reader_state::typed_array;
            data_ = typed_array_view(v.data(), v.size());
            index_ = 0;
            return this->begin_array(tag, context, ec);
        }

        bool visit_typed_array(const jsoncons::span<const uint16_t>& data, 
                            semantic_tag tag,
                            const ser_context& context,
                            std::error_code& ec) override
        {
            state_ = item_event_reader_state::typed_array;
            data_ = typed_array_view(data.data(), data.size());
            index_ = 0;
            return this->begin_array(tag, context, ec);
        }

        bool visit_typed_array(const jsoncons::span<const uint32_t>& data, 
                            semantic_tag tag,
                            const ser_context& context,
                            std::error_code& ec) override
        {
            state_ = item_event_reader_state::typed_array;
            data_ = typed_array_view(data.data(), data.size());
            index_ = 0;
            return this->begin_array(tag, context, ec);
        }

        bool visit_typed_array(const jsoncons::span<const uint64_t>& data, 
                            semantic_tag tag,
                            const ser_context& context,
                            std::error_code& ec) override
        {
            state_ = item_event_reader_state::typed_array;
            data_ = typed_array_view(data.data(), data.size());
            index_ = 0;
            return this->begin_array(tag, context, ec);
        }

        bool visit_typed_array(const jsoncons::span<const int8_t>& data, 
                            semantic_tag tag,
                            const ser_context& context,
                            std::error_code& ec) override
        {
            state_ = item_event_reader_state::typed_array;
            data_ = typed_array_view(data.data(), data.size());
            index_ = 0;
            return this->begin_array(tag, context, ec);
        }

        bool visit_typed_array(const jsoncons::span<const int16_t>& data, 
                            semantic_tag tag,
                            const ser_context& context,
                            std::error_code& ec) override
        {
            state_ = item_event_reader_state::typed_array;
            data_ = typed_array_view(data.data(), data.size());
            index_ = 0;
            return this->begin_array(tag, context, ec);
        }

        bool visit_typed_array(const jsoncons::span<const int32_t>& data, 
                            semantic_tag tag,
                            const ser_context& context,
                            std::error_code& ec) override
        {
            state_ = item_event_reader_state::typed_array;
            data_ = typed_array_view(data.data(), data.size());
            index_ = 0;
            return this->begin_array(tag, context, ec);
        }

        bool visit_typed_array(const jsoncons::span<const int64_t>& data, 
                            semantic_tag tag,
                            const ser_context& context,
                            std::error_code& ec) override
        {
            state_ = item_event_reader_state::typed_array;
            data_ = typed_array_view(data.data(), data.size());
            index_ = 0;
            return this->begin_array(tag, context, ec);
        }

        bool visit_typed_array(half_arg_t, const jsoncons::span<const uint16_t>& data, 
                            semantic_tag tag,
                            const ser_context& context,
                            std::error_code& ec) override
        {
            state_ = item_event_reader_state::typed_array;
            data_ = typed_array_view(data.data(), data.size());
            index_ = 0;
            return this->begin_array(tag, context, ec);
        }

        bool visit_typed_array(const jsoncons::span<const float>& data, 
                            semantic_tag tag,
                            const ser_context& context,
                            std::error_code& ec) override
        {
            state_ = item_event_reader_state::typed_array;
            data_ = typed_array_view(data.data(), data.size());
            index_ = 0;
            return this->begin_array(tag, context, ec);
        }

        bool visit_typed_array(const jsoncons::span<const double>& data, 
                            semantic_tag tag,
                            const ser_context& context,
                            std::error_code& ec) override
        {
            state_ = item_event_reader_state::typed_array;
            data_ = typed_array_view(data.data(), data.size());
            index_ = 0;
            return this->begin_array(tag, context, ec);
        }
    /*
        bool visit_typed_array(const jsoncons::span<const float128_type>&, 
                            semantic_tag,
                            const ser_context&,
                            std::error_code&) override
        {
            return true;
        }
    */
        bool visit_begin_multi_dim(const jsoncons::span<const size_t>& shape,
                                semantic_tag tag,
                                const ser_context& context, 
                                std::error_code& ec) override
        {
            state_ = item_event_reader_state::multi_dim;
            shape_ = shape;
            return this->begin_array(2, tag, context, ec);
        }

        bool visit_end_multi_dim(const ser_context& context,
                              std::error_code& ec) override
        {
            return this->end_array(context, ec);
        }

        void visit_flush() override
        {
        }
    };

    // basic_item_event_reader

    template<class CharT>
    class basic_item_event_reader
    {
    public:
        virtual ~basic_item_event_reader() noexcept = default;

        virtual void array_expected(std::error_code& ec)
        {
            if (!(current().event_kind() == item_event_kind::begin_array || current().event_kind() == item_event_kind::byte_string_value))
            {
                ec = conv_errc::not_vector;
            }
        }

        virtual bool done() const = 0;

        virtual const basic_item_event<CharT>& current() const = 0;

        virtual void read_to(basic_item_event_visitor<CharT>& visitor) = 0;

        virtual void read_to(basic_item_event_visitor<CharT>& visitor,
                             std::error_code& ec) = 0;

        virtual void next() = 0;

        virtual void next(std::error_code& ec) = 0;

        virtual const ser_context& context() const = 0;
    };

    template<class CharT>
    class basic_staj2_filter_view : basic_item_event_reader<CharT>
    {
        basic_item_event_reader<CharT>* cursor_;
        std::function<bool(const basic_item_event<CharT>&, const ser_context&)> pred_;
    public:
        basic_staj2_filter_view(basic_item_event_reader<CharT>& cursor,
                         std::function<bool(const basic_item_event<CharT>&, const ser_context&)> pred)
            : cursor_(std::addressof(cursor)), pred_(pred)
        {
            while (!done() && !pred_(current(),context()))
            {
                cursor_->next();
            }
        }

        bool done() const override
        {
            return cursor_->done();
        }

        const basic_item_event<CharT>& current() const override
        {
            return cursor_->current();
        }

        void read_to(basic_item_event_visitor<CharT>& visitor) override
        {
            cursor_->read_to(visitor);
        }

        void read_to(basic_item_event_visitor<CharT>& visitor,
                     std::error_code& ec) override
        {
            cursor_->read_to(visitor, ec);
        }

        void next() override
        {
            cursor_->next();
            while (!done() && !pred_(current(),context()))
            {
                cursor_->next();
            }
        }

        void next(std::error_code& ec) override
        {
            cursor_->next(ec);
            while (!done() && !pred_(current(),context()) && !ec)
            {
                cursor_->next(ec);
            }
        }

        const ser_context& context() const override
        {
            return cursor_->context();
        }

        friend
            basic_staj2_filter_view<CharT> operator|(basic_staj2_filter_view& cursor,
                                          std::function<bool(const basic_item_event<CharT>&, const ser_context&)> pred)
        {
            return basic_staj2_filter_view<CharT>(cursor, pred);
        }
    };

    using item_event = basic_item_event<char>;
    using witem_event = basic_item_event<wchar_t>;

    using item_event_reader = basic_item_event_reader<char>;
    using witem_event_reader = basic_item_event_reader<wchar_t>;

    using staj2_filter_view = basic_staj2_filter_view<char>;
    using wstaj2_filter_view = basic_staj2_filter_view<wchar_t>;

} // namespace jsoncons

#endif

