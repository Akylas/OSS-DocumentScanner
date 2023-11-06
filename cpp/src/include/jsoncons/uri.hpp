// Copyright 2013-2023 Daniel Parker
// Distributed under the Boost license, Version 1.0.
// (See accompanying file LICENSE_1_0.txt or copy at http://www.boost.org/LICENSE_1_0.txt)

// See https://github.com/danielaparker/jsoncons for latest version

#ifndef JSONCONS_URI_HPP
#define JSONCONS_URI_HPP

#include <string> // std::string
#include <algorithm> 
#include <sstream> 
#include <jsoncons/config/jsoncons_config.hpp>
#include <jsoncons/json_exception.hpp>

namespace jsoncons {

    class uri
    {
        using part_type = std::pair<std::size_t,std::size_t>;

        std::string uri_;
        part_type scheme_;
        part_type userinfo_;
        part_type host_;
        part_type port_;
        part_type path_;
        part_type query_;
        part_type fragment_;
    public:

        uri() = default;

        uri(const std::string& uri)
        {
            *this = parse(uri);
        }

        uri(jsoncons::string_view scheme,
            jsoncons::string_view userinfo,
            jsoncons::string_view host,
            jsoncons::string_view port,
            jsoncons::string_view path,
            jsoncons::string_view query,
            jsoncons::string_view fragment)
        {
            if (!scheme.empty()) 
            {
                uri_.append(std::string(scheme));
                scheme_.second = uri_.length();
            }
            if (!userinfo.empty() || !host.empty() || !port.empty()) 
            {
                if (!scheme.empty()) 
                {
                    uri_.append("://");
                }

                if (!userinfo.empty()) 
                {
                    userinfo_.first = uri_.length();
                    uri_.append(std::string(userinfo));
                    userinfo_.second = uri_.length();
                    uri_.append("@");
                }
                else
                {
                    userinfo_.first = userinfo_.second = uri_.length();
                }

                if (!host.empty()) 
                {
                    host_.first = uri_.length();
                    uri_.append(std::string(host));
                    host_.second = uri_.length();
                } 
                else 
                {
                    JSONCONS_THROW(json_runtime_error<std::invalid_argument>("uri error."));
                }

                if (!port.empty()) 
                {
                    uri_.append(":");
                    port_.first = uri_.length();
                    uri_.append(std::string(port));
                    port_.second = uri_.length();
                }
                else
                {
                    port_.first = port_.second = uri_.length();
                }
            }
            else 
            {
                userinfo_.first = userinfo_.second = uri_.length();
                host_.first = host_.second = uri_.length();
                port_.first = port_.second = uri_.length();
                if (!scheme.empty())
                {
                    if (!path.empty() || !query.empty() || !fragment.empty()) 
                    {
                        uri_.append(":");
                    } 
                    else 
                    {
                        JSONCONS_THROW(json_runtime_error<std::invalid_argument>("uri error."));
                    }
                }
            }

            if (!path.empty()) 
            {
                // if the URI is not opaque and the path is not already prefixed
                // with a '/', add one.
                path_.first = uri_.length();
                if (!host.empty() && (path.front() != '/')) 
                {
                    uri_.push_back('/');
                }
                uri_.append(std::string(path));
                path_.second = uri_.length();
            }
            else
            {
                path_.first = path_.second = uri_.length();
            }

            if (!query.empty()) 
            {
                uri_.append("?");
                query_.first = uri_.length();
                uri_.append(std::string(query));
                query_.second = uri_.length();
            }
            else
            {
                query_.first = query_.second = uri_.length();
            }

            if (!fragment.empty()) 
            {
                uri_.append("#");
                fragment_.first = uri_.length();
                uri_.append(std::string(fragment));
                fragment_.second = uri_.length();
            }
            else
            {
                fragment_.first = fragment_.second = uri_.length();
            }
        }

        const std::string& string() const
        {
            return uri_;
        }

        bool is_absolute() const noexcept
        {
            return scheme_.first != scheme_.second;
        }

        bool is_opaque() const noexcept 
        {
          return is_absolute() && !authority().empty();
        }

        string_view base() const noexcept { return string_view(uri_.data()+scheme_.first,(path_.second-scheme_.first)); }

        string_view scheme() const noexcept { return string_view(uri_.data()+scheme_.first,(scheme_.second-scheme_.first)); }

        string_view userinfo() const noexcept { return string_view(uri_.data()+userinfo_.first,(userinfo_.second-userinfo_.first)); }

        string_view host() const noexcept { return string_view(uri_.data()+host_.first,(host_.second-host_.first)); }

        string_view port() const noexcept { return string_view(uri_.data()+port_.first,(port_.second-port_.first)); }

        string_view path() const noexcept { return string_view(uri_.data()+path_.first,(path_.second-path_.first)); }

        string_view query() const noexcept { return string_view(uri_.data()+query_.first,(query_.second-query_.first)); }

        string_view fragment() const noexcept { return string_view(uri_.data()+fragment_.first,(fragment_.second-fragment_.first)); }

        string_view authority() const noexcept { return string_view(uri_.data()+userinfo_.first,(port_.second-userinfo_.first)); }

        uri resolve(const uri& base) const
        {
            // This implementation uses the psuedo-code given in
            // http://tools.ietf.org/html/rfc3986#section-5.2.2

            if (is_absolute() && !is_opaque()) 
            {
                return *this;
            }

            if (is_opaque()) 
            {
                return *this;
            }

            std::string userinfo, host, port, path, query, fragment;

            if (!authority().empty()) 
            {
              // g -> http://g
              if (!this->userinfo().empty()) 
              {
                  userinfo = std::string(this->userinfo());
              }

              if (!this->host().empty()) 
              {
                  host = std::string(this->host());
              }

              if (!this->port().empty()) 
              {
                  port = std::string(this->port());
              }

              if (!this->path().empty()) 
              {
                  path = remove_dot_segments(this->path());
              }

              if (!this->query().empty()) 
              {
                  query = std::string(this->query());
              }
            } 
            else 
            {
              if (this->path().empty()) 
              {
                if (!base.path().empty()) 
                {
                    path = std::string(base.path());
                }

                if (!this->query().empty()) 
                {
                    query = std::string(this->query());
                } 
                else if (!base.query().empty()) 
                {
                    query = std::string(base.query());
                }
              } 
              else 
              {
                  if (this->path().front() == '/') 
                  {
                    path = remove_dot_segments(this->path());
                  } 
                  else 
                  {
                      path = merge_paths(base, *this);
                  }

                  if (!this->query().empty()) 
                  {
                      query = std::string(this->query());
                  }
              }

              if (!base.userinfo().empty()) 
              {
                  userinfo = std::string(base.userinfo());
              }

              if (!base.host().empty()) 
              {
                  host = std::string(base.host());
              }

              if (!base.port().empty()) 
              {
                  port = std::string(base.port());
              }
            }

            if (!this->fragment().empty()) 
            {
                fragment = std::string(this->fragment());
            }

            return uri(std::string(base.scheme()), userinfo, host, port, path, query, fragment);
        }

        int compare(const uri& other) const
        {
            int result = scheme().compare(other.scheme());
            if (result != 0) return result;
            result = userinfo().compare(other.userinfo());
            if (result != 0) return result;
            result = host().compare(other.host());
            if (result != 0) return result;
            result = port().compare(other.port());
            if (result != 0) return result;
            result = path().compare(other.path());
            if (result != 0) return result;
            result = query().compare(other.query());
            if (result != 0) return result;
            result = fragment().compare(other.fragment());

            return result;
        }

        friend bool operator==(const uri& lhs, const uri& rhs)
        {
            return lhs.compare(rhs) == 0;
        }

        friend bool operator!=(const uri& lhs, const uri& rhs)
        {
            return lhs.compare(rhs) != 0;
        }

        friend bool operator<(const uri& lhs, const uri& rhs)
        {
            return lhs.compare(rhs) < 0;
        }

        friend bool operator<=(const uri& lhs, const uri& rhs)
        {
            return lhs.compare(rhs) <= 0;
        }

        friend bool operator>(const uri& lhs, const uri& rhs)
        {
            return lhs.compare(rhs) > 0;
        }

        friend bool operator>=(const uri& lhs, const uri& rhs)
        {
            return lhs.compare(rhs) >= 0;
        }

    private:
        enum class parse_state {expect_scheme,
                                expect_first_slash,
                                expect_second_slash,
                                expect_authority,
                                expect_host_ipv6,
                                expect_userinfo,
                                expect_host,
                                expect_port,
                                expect_path,
                                expect_query,
                                expect_fragment};

        uri(const std::string& uri, part_type scheme, part_type userinfo, 
            part_type host, part_type port, part_type path, 
            part_type query, part_type fragment)
            : uri_(uri), scheme_(scheme), userinfo_(userinfo), 
              host_(host), port_(port), path_(path), 
              query_(query), fragment_(fragment)
        {
        }

        static uri parse(const std::string& s)
        {
            part_type scheme;
            part_type userinfo;
            part_type host;
            part_type port;
            part_type path;
            part_type query;
            part_type fragment;

            std::size_t start = 0;

            parse_state state = parse_state::expect_scheme;
            for (std::size_t i = 0; i < s.size(); ++i)
            {
                char c = s[i];
                switch (state)
                {
                    case parse_state::expect_scheme:
                        switch (c)
                        {
                            case ':':
                                scheme = std::make_pair(start,i);
                                state = parse_state::expect_first_slash;
                                start = i;
                                break;
                            case '#':
                                userinfo = std::make_pair(start,start);
                                host = std::make_pair(start,start);
                                port = std::make_pair(start,start);
                                path = std::make_pair(start,i);
                                query = std::make_pair(i,i);
                                state = parse_state::expect_fragment;
                                start = i+1;
                                break;
                            default:
                                break;
                        }
                        break;
                    case parse_state::expect_first_slash:
                        switch (c)
                        {
                            case '/':
                                state = parse_state::expect_second_slash;
                                break;
                            default:
                                start = i;
                                state = parse_state::expect_path;
                                break;
                        }
                        break;
                    case parse_state::expect_second_slash:
                        switch (c)
                        {
                            case '/':
                                state = parse_state::expect_authority;
                                start = i+1;
                                break;
                            default:
                                break;
                        }
                        break;
                    case parse_state::expect_authority:
                        switch (c)
                        {
                            case '[':
                                state = parse_state::expect_host_ipv6;
                                start = i+1;
                                break;
                            default:
                                state = parse_state::expect_userinfo;
                                start = i;
                                --i;
                                break;
                        }
                        break;
                    case parse_state::expect_host_ipv6:
                        switch (c)
                        {
                            case ']':
                                userinfo = std::make_pair(start,start);
                                host = std::make_pair(start,i);
                                port = std::make_pair(i,i);
                                state = parse_state::expect_path;
                                start = i+1;
                                break;
                            default:
                                break;
                        }
                        break;
                    case parse_state::expect_userinfo:
                        switch (c)
                        {
                            case '@':
                                userinfo = std::make_pair(start,i);
                                state = parse_state::expect_host;
                                start = i+1;
                                break;
                            case ':':
                                userinfo = std::make_pair(start,start);
                                host = std::make_pair(start,i);
                                state = parse_state::expect_port;
                                start = i+1;
                                break;
                            case '/':
                                userinfo = std::make_pair(start,start);
                                host = std::make_pair(start,i);
                                port = std::make_pair(i,i);
                                state = parse_state::expect_path;
                                start = i;
                                break;
                            default:
                                break;
                        }
                        break;
                    case parse_state::expect_host:
                        switch (c)
                        {
                            case ':':
                                host = std::make_pair(start,i);
                                state = parse_state::expect_port;
                                start = i+1;
                                break;
                            default:
                                break;
                        }
                        break;
                    case parse_state::expect_port:
                        switch (c)
                        {
                            case '/':
                                port = std::make_pair(start,i);
                                state = parse_state::expect_path;
                                start = i;
                                break;
                            default:
                                break;
                        }
                        break;
                    case parse_state::expect_path:
                        switch (c)
                        {
                            case '?':
                                path = std::make_pair(start,i);
                                state = parse_state::expect_query;
                                start = i+1;
                                break;
                            case '#':
                                path = std::make_pair(start,i);
                                query = std::make_pair(start,start);
                                state = parse_state::expect_fragment;
                                start = i+1;
                                break;
                            default:
                                break;
                        }
                        break;
                    case parse_state::expect_query:
                        switch (c)
                        {
                            case '#':
                                query = std::make_pair(start,i);
                                state = parse_state::expect_fragment;
                                start = i+1;
                                break;
                            default:
                                break;
                        }
                        break;
                    case parse_state::expect_fragment:
                        break;
                }
            }
            switch (state)
            {
                case parse_state::expect_scheme:
                    userinfo = std::make_pair(start,start);
                    host = std::make_pair(start,start);
                    port = std::make_pair(start,start);
                    path = std::make_pair(start,s.size());
                    break;
                case parse_state::expect_userinfo:
                    userinfo = std::make_pair(start,start);
                    host = std::make_pair(start,start);
                    port = std::make_pair(start,start);
                    path = std::make_pair(start,s.size());
                    break;
                case parse_state::expect_path:
                    path = std::make_pair(start,s.size());
                    break;
                case parse_state::expect_query:
                    query = std::make_pair(start,s.size());
                    break;
                case parse_state::expect_fragment:
                    fragment = std::make_pair(start,s.size());
                    break;
                default:
                    JSONCONS_THROW(std::invalid_argument("Invalid uri"));
                    break;
            }

            return uri(s, scheme, userinfo, host, port, path, query, fragment);
        }

        static std::string remove_dot_segments(const jsoncons::string_view& input)
        {
            std::string result = std::string(input);
/*
            std::size_t pos = 0;
            while (pos < input.size()) 
            {
              if (input.compare(0, 3, "../")) 
              {
                network_boost::erase_head(input, 3);
              } else if (network_boost::starts_with(input, "./")) {
                network_boost::erase_head(input, 2);
              } else if (network_boost::starts_with(input, "/./")) {
                network_boost::replace_head(input, 3, "/");
              } else if (input == "/.") {
                network_boost::replace_head(input, 2, "/");
              } else if (network_boost::starts_with(input, "/../")) {
                network_boost::erase_head(input, 3);
                remove_last_segment(result);
              } else if (network_boost::starts_with(input, "/..")) {
                network_boost::replace_head(input, 3, "/");
                remove_last_segment(result);
              } else if (network_boost::algorithm::all(input, [](char ch) { return ch == '.'; })) {
                input.clear();
              }
              else {
                int n = (input.front() == '/')? 1 : 0;
                auto slash = network_boost::find_nth(input, "/", n);
                result.append(std::begin(input), std::begin(slash));
                input.erase(std::begin(input), std::begin(slash));
              }
            }
*/
            return result;
        }

        static std::string merge_paths(const uri& base, const uri& relative)
        {
            std::string result;

            if (base.path().empty()) 
            {
                result = "/";
            } 
            else 
            {
                const auto& base_path = base.path();
                auto last_slash = base_path.rfind('/');
                result.append(std::string(base_path.substr(0,last_slash+1)));
            }
            if (!relative.path().empty()) 
            {
                result.append(relative.path().begin(), relative.path().end());
            }
            return remove_dot_segments(jsoncons::string_view(result));
        }

        static void remove_last_segment(std::string& path) 
        {
            auto last_slash = path.rfind('/');
            if (last_slash != std::string::npos)
            {
                path.erase(last_slash);
            }
        }
    };

} // namespace jsoncons

#endif
