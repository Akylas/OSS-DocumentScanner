// Copyright 2013-2023 Daniel Parker
// Distributed under the Boost license, Version 1.0.
// (See accompanying file LICENSE_1_0.txt or copy at http://www.boost.org/LICENSE_1_0.txt)

// See https://github.com/danielaparker/jsoncons for latest version

#ifndef JSONCONS_ENCODE_JSON_HPP
#define JSONCONS_ENCODE_JSON_HPP

#include <iostream>
#include <string>
#include <tuple>
#include <memory>
#include <istream> // std::basic_istream
#include <jsoncons/encode_traits.hpp>
#include <jsoncons/json_cursor.hpp>

namespace jsoncons {

    // to string

    template <class T, class CharContainer>
    typename std::enable_if<extension_traits::is_basic_json<T>::value &&
        extension_traits::is_back_insertable_char_container<CharContainer>::value>::type
    encode_json(const T& val, CharContainer& cont, 
        const basic_json_encode_options<typename CharContainer::value_type>& options = 
            basic_json_encode_options<typename CharContainer::value_type>(),
        indenting indent = indenting::no_indent)
    {
        using char_type = typename CharContainer::value_type;

        if (indent == indenting::no_indent)
        {
            basic_compact_json_encoder<char_type, jsoncons::string_sink<CharContainer>> encoder(cont, options);
            val.dump(encoder);
        }
        else
        {
            basic_json_encoder<char_type,jsoncons::string_sink<CharContainer>> encoder(cont, options);
            val.dump(encoder);
        }
    }

    template <class T, class CharContainer>
    typename std::enable_if<!extension_traits::is_basic_json<T>::value &&
                            extension_traits::is_back_insertable_char_container<CharContainer>::value>::type
    encode_json(const T& val, CharContainer& cont, 
        const basic_json_encode_options<typename CharContainer::value_type>& options = 
            basic_json_encode_options<typename CharContainer::value_type>(),
        indenting indent = indenting::no_indent)
    {
        using char_type = typename CharContainer::value_type;

        if (indent == indenting::no_indent)
        {
            basic_compact_json_encoder<char_type, jsoncons::string_sink<CharContainer>> encoder(cont, options);
            encode_json(val, encoder);
        }
        else
        {
            basic_json_encoder<char_type, jsoncons::string_sink<CharContainer>> encoder(cont, options);
            encode_json(val, encoder);
        }
    }

    // to stream

    template <class T, class CharT>
    typename std::enable_if<extension_traits::is_basic_json<T>::value>::type
    encode_json(const T& val, std::basic_ostream<CharT>& os, 
        const basic_json_encode_options<CharT>& options = basic_json_encode_options<CharT>(),
        indenting indent = indenting::no_indent)
    {
        if (indent == indenting::no_indent)
        {
            basic_compact_json_encoder<CharT> encoder(os, options);
            val.dump(encoder);
        }
        else
        {
            basic_json_encoder<CharT> encoder(os, options);
            val.dump(encoder);
        }
    }

    template <class T, class CharT>
    typename std::enable_if<!extension_traits::is_basic_json<T>::value>::type
    encode_json(const T& val, std::basic_ostream<CharT>& os, 
        const basic_json_encode_options<CharT>& options = basic_json_encode_options<CharT>(),
        indenting indent = indenting::no_indent)
    {
        if (indent == indenting::no_indent)
        {
            basic_compact_json_encoder<CharT> encoder(os, options);
            encode_json(val, encoder);
        }
        else
        {
            basic_json_encoder<CharT> encoder(os, options);
            encode_json(val, encoder);
        }
    }

    // to string with allocator_set

    template <class T, class CharContainer,class Allocator,class TempAllocator>
    typename std::enable_if<extension_traits::is_basic_json<T>::value &&
        extension_traits::is_back_insertable_char_container<CharContainer>::value>::type
    encode_json(const allocator_set<Allocator,TempAllocator>& alloc_set,
        const T& val, CharContainer& cont, 
        const basic_json_encode_options<typename CharContainer::value_type>& options = 
            basic_json_encode_options<typename CharContainer::value_type>(),
        indenting indent = indenting::no_indent)
    {
        using char_type = typename CharContainer::value_type;

        if (indent == indenting::no_indent)
        {
            basic_compact_json_encoder<char_type, jsoncons::string_sink<CharContainer>,TempAllocator> encoder(cont, options, alloc_set.get_temp_allocator());
            val.dump(encoder);
        }
        else
        {
            basic_json_encoder<char_type,jsoncons::string_sink<CharContainer>,TempAllocator> encoder(cont, options, alloc_set.get_temp_allocator());
            val.dump(encoder);
        }
    }

    template <class T, class CharContainer,class Allocator,class TempAllocator>
    typename std::enable_if<!extension_traits::is_basic_json<T>::value &&
                            extension_traits::is_back_insertable_char_container<CharContainer>::value>::type
    encode_json(const allocator_set<Allocator,TempAllocator>& alloc_set,
        const T& val, CharContainer& cont, 
        const basic_json_encode_options<typename CharContainer::value_type>& options = 
            basic_json_encode_options<typename CharContainer::value_type>(),
        indenting indent = indenting::no_indent)
    {
        using char_type = typename CharContainer::value_type;

        if (indent == indenting::no_indent)
        {
            basic_compact_json_encoder<char_type, jsoncons::string_sink<CharContainer>,TempAllocator> encoder(cont, options,
                alloc_set.get_temp_allocator());
            encode_json(val, encoder);
        }
        else
        {
            basic_json_encoder<char_type, jsoncons::string_sink<CharContainer>, TempAllocator> encoder(cont, options, 
                alloc_set.get_temp_allocator());
            encode_json(val, encoder);
        }
    }

    // to stream with allocator_set

    template <class T, class CharT,class Allocator,class TempAllocator>
    typename std::enable_if<extension_traits::is_basic_json<T>::value>::type
    encode_json(const allocator_set<Allocator,TempAllocator>& alloc_set,
        const T& val, std::basic_ostream<CharT>& os, 
        const basic_json_encode_options<CharT>& options = basic_json_encode_options<CharT>(),
        indenting indent = indenting::no_indent)
    {
        if (indent == indenting::no_indent)
        {
            basic_compact_json_encoder<CharT,TempAllocator> encoder(os, options, alloc_set.get_temp_allocator());
            val.dump(encoder);
        }
        else
        {
            basic_json_encoder<CharT,TempAllocator> encoder(os, options, alloc_set.get_temp_allocator());
            val.dump(encoder);
        }
    }

    template <class T, class CharT,class Allocator,class TempAllocator>
    typename std::enable_if<!extension_traits::is_basic_json<T>::value>::type
    encode_json(const allocator_set<Allocator,TempAllocator>& alloc_set,
        const T& val, std::basic_ostream<CharT>& os, 
        const basic_json_encode_options<CharT>& options = basic_json_encode_options<CharT>(),
        indenting indent = indenting::no_indent)
    {
        if (indent == indenting::no_indent)
        {
            basic_compact_json_encoder<CharT,TempAllocator> encoder(os, options, alloc_set.get_temp_allocator());
            encode_json(val, encoder);
        }
        else
        {
            basic_json_encoder<CharT,TempAllocator> encoder(os, options, alloc_set.get_temp_allocator());
            encode_json(val, encoder);
        }
    }

    // to encoder

    template <class T, class CharT>
    void encode_json(const T& val, basic_json_visitor<CharT>& encoder)
    {
        std::error_code ec;
        encode_traits<T,CharT>::encode(val, encoder, basic_json<CharT>(), ec);
        if (ec)
        {
            JSONCONS_THROW(ser_error(ec));
        }
        encoder.flush();
    }

    // encode_json_pretty

    template <class T, class CharContainer>
    typename std::enable_if<extension_traits::is_basic_json<T>::value &&
                            extension_traits::is_back_insertable_char_container<CharContainer>::value>::type
    encode_json_pretty(const T& val,
                       CharContainer& cont, 
                       const basic_json_encode_options<typename CharContainer::value_type>& options = basic_json_encode_options<typename CharContainer::value_type>())
    {
        using char_type = typename CharContainer::value_type;

        basic_json_encoder<char_type,jsoncons::string_sink<CharContainer>> encoder(cont, options);
        val.dump(encoder);
    }

    template <class T, class CharContainer>
    typename std::enable_if<!extension_traits::is_basic_json<T>::value &&
                            extension_traits::is_back_insertable_char_container<CharContainer>::value>::type
    encode_json_pretty(const T& val,
                       CharContainer& cont, 
                       const basic_json_encode_options<typename CharContainer::value_type>& options = basic_json_encode_options<typename CharContainer::value_type>())
    {
        using char_type = typename CharContainer::value_type;
        basic_json_encoder<char_type,jsoncons::string_sink<CharContainer>> encoder(cont, options);
        encode_json(val, encoder);
    }

    template <class T, class CharT>
    typename std::enable_if<extension_traits::is_basic_json<T>::value>::type
    encode_json_pretty(const T& val,
                       std::basic_ostream<CharT>& os, 
                       const basic_json_encode_options<CharT>& options = basic_json_encode_options<CharT>())
    {
        basic_json_encoder<CharT> encoder(os, options);
        val.dump(encoder);
    }

    template <class T, class CharT>
    typename std::enable_if<!extension_traits::is_basic_json<T>::value>::type
    encode_json_pretty(const T& val,
                       std::basic_ostream<CharT>& os, 
                       const basic_json_encode_options<CharT>& options = basic_json_encode_options<CharT>())
    {
        basic_json_encoder<CharT> encoder(os, options);
        encode_json(val, encoder);
    }

// legacy

    template <class T, class CharContainer>
    void encode_json(const T& val, CharContainer& cont, indenting indent)
    {
        if (indent == indenting::indent)
        {
            encode_json_pretty(val,cont);
        }
        else
        {
            encode_json(val,cont);
        }
    }

    template <class T, class CharT>
    void encode_json(const T& val,
                     std::basic_ostream<CharT>& os, 
                     indenting indent)
    {
        if (indent == indenting::indent)
        {
            encode_json_pretty(val, os);
        }
        else
        {
            encode_json(val, os);
        }
    }

//end legacy

} // jsoncons

#endif

