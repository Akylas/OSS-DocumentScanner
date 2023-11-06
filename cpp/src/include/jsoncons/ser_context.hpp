/// Copyright 2013-2023 Daniel Parker
// Distributed under the Boost license, Version 1.0.
// (See accompanying file LICENSE_1_0.txt or copy at http://www.boost.org/LICENSE_1_0.txt)

// See https://github.com/danielaparker/jsoncons for latest version

#ifndef JSONCONS_SER_CONTEXT_HPP
#define JSONCONS_SER_CONTEXT_HPP

namespace jsoncons {

class ser_context
{
public:
    virtual ~ser_context() noexcept = default;

    virtual size_t line() const
    {
        return 0;
    }

    virtual size_t column() const
    {
        return 0;
    }

    virtual size_t position() const
    {
        return 0;
    }

    virtual size_t end_position() const
    {
        return 0;
    }

#if !defined(JSONCONS_NO_DEPRECATED)
    JSONCONS_DEPRECATED_MSG("Instead, use line()")
    std::size_t line_number() const
    {
        return line();
    }

    JSONCONS_DEPRECATED_MSG("Instead, use column()")
    std::size_t column_number() const 
    {
        return column();
    }
#endif
};

#if !defined(JSONCONS_NO_DEPRECATED)
JSONCONS_DEPRECATED_MSG("Instead, use ser_context") typedef ser_context null_ser_context;

JSONCONS_DEPRECATED_MSG("Instead, use ser_context") typedef ser_context parsing_context;
JSONCONS_DEPRECATED_MSG("Instead, use ser_context") typedef ser_context serializing_context;
JSONCONS_DEPRECATED_MSG("Instead, use ser_context") typedef ser_context null_parsing_context;
JSONCONS_DEPRECATED_MSG("Instead, use ser_context") typedef ser_context null_serializing_context;
#endif

}
#endif
