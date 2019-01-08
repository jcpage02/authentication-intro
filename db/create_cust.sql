insert into customer (
    email, 
    hash_value
)

values (
    ${email},
    ${hash_value}
)

returning * ;