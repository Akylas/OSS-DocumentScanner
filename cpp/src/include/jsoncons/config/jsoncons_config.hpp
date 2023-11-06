// Copyright 2013-2023 Daniel Parker
// Distributed under the Boost license, Version 1.0.
// (See accompanying file LICENSE_1_0.txt or copy at http://www.boost.org/LICENSE_1_0.txt)

// See https://github.com/danielaparker/jsoncons for latest version

#ifndef JSONCONS_CONFIG_JSONCONS_CONFIG_HPP
#define JSONCONS_CONFIG_JSONCONS_CONFIG_HPP

#include <type_traits>
#include <limits>
#include <jsoncons/config/compiler_support.hpp>
#include <jsoncons/config/binary_config.hpp>

#if !defined(JSONCONS_HAS_STD_STRING_VIEW)
#include <jsoncons/detail/string_view.hpp>
namespace jsoncons {
using jsoncons::detail::basic_string_view;
using string_view = basic_string_view<char, std::char_traits<char>>;
using wstring_view = basic_string_view<wchar_t, std::char_traits<wchar_t>>;
}
#else 
#include <string_view>
namespace jsoncons {
using std::basic_string_view;
using std::string_view;
using std::wstring_view;
}
#endif

#if !defined(JSONCONS_HAS_STD_SPAN)
#include <jsoncons/detail/span.hpp>
namespace jsoncons {
using jsoncons::detail::span;
}
#else 
#include <span>
namespace jsoncons {
using std::span;
}
#endif

#if defined(JSONCONS_HAS_STD_OPTIONAL)
    #include <optional>
    namespace jsoncons {
    using std::optional;
    }
#elif defined(JSONCONS_HAS_BOOST_OPTIONAL)
    #include <boost/optional.hpp>
    namespace jsoncons {
    using boost::optional;
    }
#else 
    #include <jsoncons/detail/optional.hpp>
    namespace jsoncons {
    using jsoncons::detail::optional;
}
#endif // !defined(JSONCONS_HAS_STD_OPTIONAL)

#if !defined(JSONCONS_HAS_STD_ENDIAN)
#include <jsoncons/detail/endian.hpp>
namespace jsoncons {
using jsoncons::detail::endian;
}
#else
#include <bit>
namespace jsoncons 
{
    using std::endian;
}
#endif

#if !defined(JSONCONS_HAS_STD_MAKE_UNIQUE)

#include <cstddef>
#include <memory>
#include <type_traits>
#include <utility>

namespace jsoncons {

    template<class T> 
    struct unique_if 
    {
        using value_is_not_array = std::unique_ptr<T>;
    };

    template<class T> 
    struct unique_if<T[]> 
    {
        typedef std::unique_ptr<T[]> value_is_array_of_unknown_bound;
    };

    template<class T, std::size_t N> 
    struct unique_if<T[N]> {
        using value_is_array_of_known_bound = void;
    };

    template<class T, class... Args>
    typename unique_if<T>::value_is_not_array
    make_unique(Args&&... args) 
    {
        return std::unique_ptr<T>(new T(std::forward<Args>(args)...));
    }

    template<class T>
    typename unique_if<T>::value_is_array_of_unknown_bound
    make_unique(std::size_t n) 
    {
        using U = typename std::remove_extent<T>::type;
        return std::unique_ptr<T>(new U[n]());
    }

    template<class T, class... Args>
    typename unique_if<T>::value_is_array_of_known_bound
    make_unique(Args&&...) = delete;
} // jsoncons

#else

#include <memory>
namespace jsoncons 
{
    using std::make_unique;
}

#endif // !defined(JSONCONS_HAS_STD_MAKE_UNIQUE)

namespace jsoncons {
namespace binary {

    // native_to_big

    template<typename T, class OutputIt, class Endian=endian>
    typename std::enable_if<Endian::native == Endian::big,void>::type
    native_to_big(T val, OutputIt d_first)
    {
        uint8_t buf[sizeof(T)];
        std::memcpy(buf, &val, sizeof(T));
        for (auto item : buf)
        {
            *d_first++ = item;
        }
    }

    template<typename T, class OutputIt, class Endian=endian>
    typename std::enable_if<Endian::native == Endian::little,void>::type
    native_to_big(T val, OutputIt d_first)
    {
        T val2 = byte_swap(val);
        uint8_t buf[sizeof(T)];
        std::memcpy(buf, &val2, sizeof(T));
        for (auto item : buf)
        {
            *d_first++ = item;
        }
    }

    // native_to_little

    template<typename T, class OutputIt, class Endian = endian>
    typename std::enable_if<Endian::native == Endian::little,void>::type
    native_to_little(T val, OutputIt d_first)
    {
        uint8_t buf[sizeof(T)];
        std::memcpy(buf, &val, sizeof(T));
        for (auto item : buf)
        {
            *d_first++ = item;
        }
    }

    template<typename T, class OutputIt, class Endian=endian>
    typename std::enable_if<Endian::native == Endian::big, void>::type
    native_to_little(T val, OutputIt d_first)
    {
        T val2 = byte_swap(val);
        uint8_t buf[sizeof(T)];
        std::memcpy(buf, &val2, sizeof(T));
        for (auto item : buf)
        {
            *d_first++ = item;
        }
    }

    // big_to_native

    template<class T,class Endian=endian>
    typename std::enable_if<Endian::native == Endian::big,T>::type
    big_to_native(const uint8_t* first, std::size_t count)
    {
        if (sizeof(T) > count)
        {
            return T{};
        }
        T val;
        std::memcpy(&val,first,sizeof(T));
        return val;
    }

    template<class T,class Endian=endian>
    typename std::enable_if<Endian::native == Endian::little,T>::type
    big_to_native(const uint8_t* first, std::size_t count)
    {
        if (sizeof(T) > count)
        {
            return T{};
        }
        T val;
        std::memcpy(&val,first,sizeof(T));
        return byte_swap(val);
    }

    // little_to_native

    template<class T,class Endian=endian>
    typename std::enable_if<Endian::native == Endian::little,T>::type
    little_to_native(const uint8_t* first, std::size_t count)
    {
        if (sizeof(T) > count)
        {
            return T{};
        }
        T val;
        std::memcpy(&val,first,sizeof(T));
        return val;
    }

    template<class T,class Endian=endian>
    typename std::enable_if<Endian::native == Endian::big,T>::type
    little_to_native(const uint8_t* first, std::size_t count)
    {
        if (sizeof(T) > count)
        {
            return T{};
        }
        T val;
        std::memcpy(&val,first,sizeof(T));
        return byte_swap(val);
    }

} // binary
} // jsoncons

namespace jsoncons {

    template<typename CharT>
    constexpr const CharT* cstring_constant_of_type(const char* c, const wchar_t* w);

    template<> inline
    constexpr const char* cstring_constant_of_type<char>(const char* c, const wchar_t*)
    {
        return c;
    }
    template<> inline
    constexpr const wchar_t* cstring_constant_of_type<wchar_t>(const char*, const wchar_t* w)
    {
        return w;
    }

    template<typename CharT>
    std::basic_string<CharT> string_constant_of_type(const char* c, const wchar_t* w);

    template<> inline
    std::string string_constant_of_type<char>(const char* c, const wchar_t*)
    {
        return std::string(c);
    }
    template<> inline
    std::wstring string_constant_of_type<wchar_t>(const char*, const wchar_t* w)
    {
        return std::wstring(w);
    }

    template<typename CharT>
    jsoncons::basic_string_view<CharT> string_view_constant_of_type(const char* c, const wchar_t* w);

    template<> inline
    jsoncons::string_view string_view_constant_of_type<char>(const char* c, const wchar_t*)
    {
        return jsoncons::string_view(c);
    }
    template<> inline
    jsoncons::wstring_view string_view_constant_of_type<wchar_t>(const char*, const wchar_t* w)
    {
        return jsoncons::wstring_view(w);
    }

} // jsoncons

#define JSONCONS_EXPAND(X) X    
#define JSONCONS_QUOTE(Prefix, A) JSONCONS_EXPAND(Prefix ## #A)
#define JSONCONS_WIDEN(A) JSONCONS_EXPAND(L ## A)

#define JSONCONS_CSTRING_CONSTANT(CharT, Str) cstring_constant_of_type<CharT>(Str, JSONCONS_WIDEN(Str))
#define JSONCONS_STRING_CONSTANT(CharT, Str) string_constant_of_type<CharT>(Str, JSONCONS_WIDEN(Str))
#define JSONCONS_STRING_VIEW_CONSTANT(CharT, Str) string_view_constant_of_type<CharT>(Str, JSONCONS_WIDEN(Str))

#if defined(__clang__) 
#define JSONCONS_HAS_STD_REGEX 1
#define JSONCONS_HAS_STATEFUL_ALLOCATOR 1
#elif (defined(__GNUC__) && (__GNUC__ == 4)) && (defined(__GNUC__) && __GNUC_MINOR__ < 9)
// GCC 4.8 has broken regex support: https://gcc.gnu.org/bugzilla/show_bug.cgi?id=53631
// gcc 4.8 basic_string doesn't satisfy C++11 allocator requirements
// and gcc doesn't support allocators with no default constructor
#else
#define JSONCONS_HAS_STD_REGEX 1
#define JSONCONS_HAS_STATEFUL_ALLOCATOR 1
#endif

#endif // JSONCONS_CONFIG_JSONCONS_CONFIG_HPP


